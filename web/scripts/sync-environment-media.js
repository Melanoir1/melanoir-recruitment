#!/usr/bin/env node
/**
 * site/recruitment/environment(green cluster)/ → manifest (+ 선택: Cloudinary 업로드)
 *
 * 로컬만 (배포용, API 불필요):
 *   node scripts/sync-environment-media.js
 *   node scripts/sync-environment-media.js --local
 *
 * Cloudinary 업로드 후 CDN URL manifest:
 *   .env 에 키 설정 후: node scripts/sync-environment-media.js --upload
 */
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

/** 프로젝트 루트 .env → process.env (Node는 .env를 자동 로드하지 않음) */
function loadDotEnv() {
  var envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  var text = fs.readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
  text.split(/\r?\n/).forEach(function (line) {
    line = line.trim();
    if (!line || line.charAt(0) === "#") return;
    var eq = line.indexOf("=");
    if (eq < 1) return;
    var name = line.slice(0, eq).trim();
    var value = line.slice(eq + 1).trim();
    if (
      (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') ||
      (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'")
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[name] === undefined) process.env[name] = value;
  });
}

loadDotEnv();

const LOCAL_DIR = path.join(ROOT, "site/recruitment/environment(green cluster)");
const OUT = path.join(ROOT, "site/assets/space-green-cluster.json");
const CLOUD = process.env.CLOUDINARY_CLOUD_NAME || "dssuxurpt";
const FOLDER = process.env.CLOUDINARY_SPACE_FOLDER || "space(green cluster)";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);
/**
 * 슬라이드·Cloudinary 업로드에서 제외 (소문자 파일명).
 * c.png: 채용 페이지 캐러셀에 넣지 않기로 한 파일 (로컬에는 유지 가능).
 */
const EXCLUDE_FILES = new Set(["c.png"]);

const uploadMode = process.argv.includes("--upload");
const localOnly = process.argv.includes("--local") || !uploadMode;

const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function listLocalFiles() {
  if (!fs.existsSync(LOCAL_DIR)) {
    console.error("Missing folder: " + LOCAL_DIR);
    process.exit(1);
  }
  return fs
    .readdirSync(LOCAL_DIR)
    .filter(function (name) {
      if (name.startsWith(".")) return false;
      if (EXCLUDE_FILES.has(name.toLowerCase())) return false;
      const ext = path.extname(name).toLowerCase();
      return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext);
    })
    .sort(naturalSort);
}

function mediaType(ext) {
  return VIDEO_EXT.has(ext) ? "video" : "image";
}

function localUrl(filename) {
  var segment = "environment(green cluster)/" + filename;
  return "/recruitment/" + segment.split("/").map(encodeURIComponent).join("/");
}

function signUploadParams(params, apiSecret) {
  var sorted = Object.keys(params)
    .sort()
    .map(function (k) {
      return k + "=" + params[k];
    })
    .join("&");
  return crypto.createHash("sha1").update(sorted + apiSecret).digest("hex");
}

async function uploadFile(filePath, filename) {
  var ext = path.extname(filename).toLowerCase();
  var type = mediaType(ext);
  var resource = type === "video" ? "video" : "image";
  var publicId = path.basename(filename, ext);
  var timestamp = Math.round(Date.now() / 1000);

  var signParams = {
    folder: FOLDER,
    overwrite: "true",
    public_id: publicId,
    timestamp: String(timestamp),
  };
  var signature = signUploadParams(signParams, secret);

  var form = new FormData();
  var buffer = fs.readFileSync(filePath);
  var blob = new Blob([buffer]);
  form.append("file", blob, filename);
  form.append("api_key", key);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", FOLDER);
  form.append("public_id", publicId);
  form.append("overwrite", "true");

  var endpoint =
    "https://api.cloudinary.com/v1_1/" + CLOUD + "/" + resource + "/upload";
  var res = await fetch(endpoint, { method: "POST", body: form });
  var data = await res.json();

  if (!res.ok) {
    throw new Error(
      "Upload failed for " + filename + ": " + (data.error && data.error.message ? data.error.message : res.status)
    );
  }

  return {
    type: type,
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width || null,
    height: data.height || null,
    format: data.format || null,
    sourceFile: filename,
  };
}

async function main() {
  var files = listLocalFiles();
  if (!files.length) {
    console.error("No media files in " + LOCAL_DIR);
    process.exit(1);
  }

  var items = [];
  var mode = "local";

  if (uploadMode) {
    if (!key || !secret) {
      console.error("CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET required for --upload");
      process.exit(1);
    }
    mode = "cloudinary";
    console.log("Uploading " + files.length + " files to Cloudinary folder: " + FOLDER);
    for (var i = 0; i < files.length; i++) {
      var name = files[i];
      var filePath = path.join(LOCAL_DIR, name);
      process.stdout.write("  " + name + " … ");
      var item = await uploadFile(filePath, name);
      items.push(item);
      console.log("ok");
    }
  } else {
    console.log("Building local manifest from " + files.length + " files (no upload)");
    files.forEach(function (name) {
      var ext = path.extname(name).toLowerCase();
      items.push({
        type: mediaType(ext),
        url: localUrl(name),
        publicId: null,
        sourceFile: name,
      });
    });
  }

  var manifest = {
    ok: true,
    mode: mode,
    folder: FOLDER,
    localDir: "site/recruitment/environment(green cluster)",
    updatedAt: new Date().toISOString(),
    items: items,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Wrote " + items.length + " items → " + OUT);
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});

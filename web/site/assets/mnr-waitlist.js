/* ============================================================
   Melanoir — 출시 웨이트리스트 / 베타테스터 폼 (자체 호스팅)
   사용법: <div data-mnr-waitlist data-type="customer|pro|beta"></div>
   - 유형 선택 UI 없음. 페이지가 대상을 결정한다.
   - beta: SMS 본인 인증(중복 신청 방지) 후 신청 완료
   ============================================================ */
(function () {
  "use strict";

  var API_BASE = "https://verify.melanoir.co.kr";
  var API_URL = API_BASE + "/api/waitlist";
  var OTP_URL = API_BASE + "/api/waitlist/otp";

  var TECH_OPTS = [
    ['embo','엠보 (수작업·결)'], ['sooji','수지/안개 (수작업·면)'], ['combo','콤보브로우 (수작업·혼합)'],
    ['hairstroke','헤어스트록/나노 (머신·결)'], ['ombre','그라데이션/옴브레 (머신·면)'],
    ['machine_combo','머신콤보 (머신·혼합)'], ['other','기타']
  ];
  var REGION_OPTS = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];
  function optionsHtml(pairs, placeholder) {
    var h = '<option value="" disabled selected>' + placeholder + '</option>';
    for (var i = 0; i < pairs.length; i++) {
      var v = pairs[i][0], t = pairs[i][1] || pairs[i][0];
      h += '<option value="' + v + '">' + t + '</option>';
    }
    return h;
  }
  function checkboxesHtml(pairs, name) {
    var h = '';
    for (var i = 0; i < pairs.length; i++) {
      h += '<label class="mnr-wl-chk"><input type="checkbox" name="' + name + '" value="' + pairs[i][0] + '"> ' + pairs[i][1] + '</label>';
    }
    return h;
  }

  var COPY = {
    customer: {
      audience: "멜라누아 엠보 정식 출시 소식을 가장 먼저 받아보실 분을 위한 자리입니다.",
      consent: "출시 알림 발송을 위한 개인정보(연락처) 수집·이용에 동의합니다.",
      submit: "출시 알림 받기",
      done: "정식 출시 소식을 가장 먼저 보내드릴게요.",
      shop: false, insta: false, otp: false
    },
    pro: {
      audience: "멜라누아 엠보로 시술하시는 분들을 위한 자리입니다.",
      consent: "출시 알림 발송을 위한 개인정보(연락처) 수집·이용에 동의합니다.",
      submit: "출시 알림 받기",
      done: "Pro 가입 오픈 소식을 가장 먼저 보내드릴게요.",
      shop: true, insta: true, instaRequired: false, instaPlaceholder: "인스타그램 아이디", otp: false
    },
    beta: {
      audience: "시술 경험이 있는 전문가를 위한 베타테스터 모집입니다.",
      reassureNote: "이름과 전화번호는 <strong>중복 신청을 방지하기 위해</strong> 수집합니다.",
      privacyNote: "수집된 정보는 외부에 <strong>공개되지 않으며</strong>, 철저히 관리됩니다.",
      notice: "중복 신청 방지를 위해 휴대폰 본인 인증 후 신청이 완료됩니다.",
      consent: "베타테스터 모집·선정 안내를 위한 개인정보(연락처·SNS 계정) 수집·이용에 동의합니다.",
      submit: "베타테스터 신청하기",
      done: "선정 결과를 문자로 안내드릴게요. 선정 시 인스타그램 DM 인증 후 최종 확정됩니다.",
      shop: true, insta: true, instaRequired: true, instaPlaceholder: "인스타그램 계정 — 포트폴리오 확인용",
      otp: true, technique: true, techniquesAll: true, target: true, region: true
    }
  };

  function render(host) {
    var type = host.getAttribute("data-type");
    if (!COPY[type]) type = "customer";
    var c = COPY[type];

    var form = document.createElement("form");
    form.className = "mnr-wl-form";
    form.noValidate = true;

    var reassureId = c.reassureNote ? "mnr-wl-reassure-note" : "";
    var nameDesc = reassureId ? ' aria-describedby="' + reassureId + '"' : "";
    var phoneDesc = reassureId ? ' aria-describedby="' + reassureId + '"' : "";

    var phoneHtml = c.otp
      ? '<div class="mnr-wl-phone-row">' +
          '<input type="tel" name="phone" placeholder="전화번호" maxlength="13" autocomplete="tel"' + phoneDesc + ">" +
          '<button type="button" class="mnr-wl-otp-btn">인증번호 받기</button>' +
        "</div>" +
        '<div class="mnr-wl-otp-row" hidden>' +
          '<input type="text" name="otp_code" inputmode="numeric" placeholder="인증번호 6자리" maxlength="6" autocomplete="one-time-code">' +
        "</div>"
      : '<input type="tel" name="phone" placeholder="전화번호" maxlength="13" autocomplete="tel"' + phoneDesc + ">";

    form.innerHTML =
      '<p class="mnr-wl-audience">' + c.audience + "</p>" +
      '<input type="text" name="name" placeholder="이름" maxlength="50" autocomplete="name"' + nameDesc + ">" +
      phoneHtml +
      (c.reassureNote ? '<p class="mnr-wl-form-note mnr-wl-form-note--reassure" id="' + reassureId + '">' + c.reassureNote + "</p>" : "") +
      (c.insta ? '<input type="text" name="instagram" placeholder="' + c.instaPlaceholder + '" maxlength="80" autocomplete="off">' : "") +
      (c.shop ? '<input type="text" name="shop_name" placeholder="샵 이름 (선택)" maxlength="80">' : "") +
      (c.technique ? '<select name="technique" class="mnr-wl-select" required>' + optionsHtml(TECH_OPTS, '주력 기법 선택') + '</select>' : "") +
      (c.techniquesAll ? '<fieldset class="mnr-wl-chkgroup"><legend>가능 기법 (선택, 최대 3)</legend>' + checkboxesHtml(TECH_OPTS, 'techniques_all') + '</fieldset>' : "") +
      (c.target ? '<select name="target" class="mnr-wl-select" required>' + optionsHtml([['female','여성'],['male','남성'],['both','둘 다']], '주 시술 대상 선택') + '</select>' : "") +
      (c.region ? '<select name="region" class="mnr-wl-select" required>' + optionsHtml(REGION_OPTS.map(function(r){return [r,r];}), '활동 지역(시/도) 선택') + '</select>' : "") +
      (c.region ? '<input type="text" name="region_detail" placeholder="시/군/구 (선택)" maxlength="60">' : "") +
      '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;">' +
      '<label class="mnr-wl-consent"><input type="checkbox" name="consent"> ' + c.consent + "</label>" +
      (c.privacyNote ? '<p class="mnr-wl-form-note mnr-wl-form-note--privacy">' + c.privacyNote + "</p>" : "") +
      '<button type="submit" class="mnr-wl-submit">' + c.submit + "</button>" +
      (c.notice ? '<p class="mnr-wl-notice">' + c.notice + "</p>" : "") +
      '<p class="mnr-wl-msg" role="status"></p>';
    host.appendChild(form);

    if (c.otp) bindOtp(form);
    if (c.techniquesAll) {
      var chks = form.querySelectorAll('input[name="techniques_all"]');
      for (var k = 0; k < chks.length; k++) {
        chks[k].addEventListener('change', function () {
          var n = form.querySelectorAll('input[name="techniques_all"]:checked').length;
          for (var j = 0; j < chks.length; j++) chks[j].disabled = (!chks[j].checked && n >= 3);
        });
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submit(form, host, type, c);
    });
  }

  function showMsg(form, text, isError) {
    var msg = form.querySelector(".mnr-wl-msg");
    msg.textContent = text;
    msg.classList.toggle("is-error", !!isError);
  }

  function bindOtp(form) {
    var btn = form.querySelector(".mnr-wl-otp-btn");
    var phoneEl = form.querySelector('input[name="phone"]');
    var otpRow = form.querySelector(".mnr-wl-otp-row");

    btn.addEventListener("click", function () {
      var phone = phoneEl.value.replace(/-/g, "").trim();
      if (!/^01[0-9]{8,9}$/.test(phone)) {
        showMsg(form, "유효한 휴대폰 번호를 입력해주세요.", true);
        return;
      }
      btn.disabled = true;
      btn.textContent = "발송 중...";

      fetch(OTP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone })
      })
        .then(function (res) {
          return res.json().then(function (data) { return { ok: res.ok, data: data }; });
        })
        .then(function (r) {
          if (r.ok && r.data && r.data.success) {
            otpRow.hidden = false;
            form.querySelector('input[name="otp_code"]').focus();
            showMsg(form, "인증번호를 발송했습니다. 5분 안에 입력해주세요.", false);
            startCooldown(btn, 60);
          } else {
            btn.disabled = false;
            btn.textContent = "인증번호 받기";
            showMsg(form, (r.data && r.data.error) || "발송에 실패했습니다. 잠시 후 다시 시도해주세요.", true);
          }
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = "인증번호 받기";
          showMsg(form, "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", true);
        });
    });
  }

  function startCooldown(btn, seconds) {
    var remain = seconds;
    btn.disabled = true;
    btn.textContent = "재발송 (" + remain + "초)";
    var timer = setInterval(function () {
      remain -= 1;
      if (remain <= 0) {
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = "재발송";
      } else {
        btn.textContent = "재발송 (" + remain + "초)";
      }
    }, 1000);
  }

  function submit(form, host, type, c) {
    var phone = form.querySelector('input[name="phone"]').value.replace(/-/g, "").trim();
    var consent = form.querySelector('input[name="consent"]').checked;
    var instaEl = form.querySelector('input[name="instagram"]');
    var instagram = instaEl ? instaEl.value.trim().replace(/^@/, "") : "";
    var otpEl = form.querySelector('input[name="otp_code"]');
    var otpCode = otpEl ? otpEl.value.trim() : "";

    if (!/^01[0-9]{8,9}$/.test(phone)) {
      showMsg(form, "유효한 휴대폰 번호를 입력해주세요.", true);
      return;
    }
    if (c.otp && !/^[0-9]{6}$/.test(otpCode)) {
      showMsg(form, "휴대폰 인증을 진행해주세요. '인증번호 받기'를 눌러 문자로 받은 6자리를 입력하세요.", true);
      return;
    }
    if (c.insta && c.instaRequired && !instagram) {
      showMsg(form, "포트폴리오 확인을 위해 인스타그램 계정을 입력해주세요.", true);
      return;
    }
    var technique = (form.querySelector('select[name="technique"]') || {}).value || "";
    var targetVal = (form.querySelector('select[name="target"]') || {}).value || "";
    var region = (form.querySelector('select[name="region"]') || {}).value || "";
    var regionDetailEl = form.querySelector('input[name="region_detail"]');
    var regionDetail = regionDetailEl ? regionDetailEl.value.trim() : "";
    var techAllEls = form.querySelectorAll('input[name="techniques_all"]:checked');
    var techniquesAll = Array.prototype.map.call(techAllEls, function (el) { return el.value; }).join(",");
    var TECH = ["embo","sooji","combo","hairstroke","ombre","machine_combo","other"];
    if (c.technique && TECH.indexOf(technique) === -1) { showMsg(form, "주력 기법을 선택해주세요.", true); return; }
    if (c.techniquesAll && techAllEls.length > 3) { showMsg(form, "가능 기법은 최대 3개까지 선택할 수 있습니다.", true); return; }
    if (c.target && ["female","male","both"].indexOf(targetVal) === -1) { showMsg(form, "주 시술 대상을 선택해주세요.", true); return; }
    if (c.region && !region) { showMsg(form, "활동 지역을 선택해주세요.", true); return; }
    if (!consent) {
      showMsg(form, "개인정보 수집·이용에 동의해주세요.", true);
      return;
    }

    var btn = form.querySelector(".mnr-wl-submit");
    btn.disabled = true;
    showMsg(form, "신청 중...", false);

    var shopEl = form.querySelector('input[name="shop_name"]');
    var payload = {
      type: type,
      phone: phone,
      name: form.querySelector('input[name="name"]').value.trim(),
      shop_name: shopEl ? shopEl.value.trim() : "",
      instagram: instagram,
      consent: true,
      source: location.pathname,
      website: form.querySelector('input[name="website"]').value
    };
    if (c.otp) payload.otp_code = otpCode;
    if (c.technique) payload.technique = technique;
    if (c.techniquesAll) payload.techniques_all = techniquesAll;
    if (c.target) payload.target = targetVal;
    if (c.region) { payload.region = region; payload.region_detail = regionDetail; }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.success) {
          host.innerHTML =
            '<div class="mnr-wl-done"><strong>신청이 완료되었습니다.</strong>' +
            "<p>" + c.done + "</p></div>";
        } else {
          btn.disabled = false;
          showMsg(form, (result.data && result.data.error) || "처리 중 오류가 발생했습니다.", true);
        }
      })
      .catch(function () {
        btn.disabled = false;
        showMsg(form, "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", true);
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var hosts = document.querySelectorAll("[data-mnr-waitlist]");
    for (var i = 0; i < hosts.length; i++) render(hosts[i]);
  });
})();

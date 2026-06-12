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

  var COPY = {
    customer: {
      audience: "멜라누아 엠보로 시술받으신 분들을 위한 자리입니다.",
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
      notice: "중복 신청 방지를 위해 휴대폰 본인 인증 후 신청이 완료됩니다.",
      consent: "베타테스터 모집·선정 안내를 위한 개인정보(연락처·SNS 계정) 수집·이용에 동의합니다.",
      submit: "베타테스터 신청하기",
      done: "선정 결과를 문자로 안내드릴게요. 선정 시 인스타그램 DM 인증 후 최종 확정됩니다.",
      shop: true, insta: true, instaRequired: true, instaPlaceholder: "인스타그램 계정 — 포트폴리오 확인용",
      otp: true
    }
  };

  function render(host) {
    var type = host.getAttribute("data-type");
    if (!COPY[type]) type = "customer";
    var c = COPY[type];

    var form = document.createElement("form");
    form.className = "mnr-wl-form";
    form.noValidate = true;

    var phoneHtml = c.otp
      ? '<div class="mnr-wl-phone-row">' +
          '<input type="tel" name="phone" placeholder="전화번호" maxlength="13" autocomplete="tel">' +
          '<button type="button" class="mnr-wl-otp-btn">인증번호 받기</button>' +
        "</div>" +
        '<div class="mnr-wl-otp-row" hidden>' +
          '<input type="text" name="otp_code" inputmode="numeric" placeholder="인증번호 6자리" maxlength="6" autocomplete="one-time-code">' +
        "</div>"
      : '<input type="tel" name="phone" placeholder="전화번호" maxlength="13" autocomplete="tel">';

    form.innerHTML =
      '<p class="mnr-wl-audience">' + c.audience + "</p>" +
      '<input type="text" name="name" placeholder="이름" maxlength="50" autocomplete="name">' +
      phoneHtml +
      (c.insta ? '<input type="text" name="instagram" placeholder="' + c.instaPlaceholder + '" maxlength="80" autocomplete="off">' : "") +
      (c.shop ? '<input type="text" name="shop_name" placeholder="샵 이름 (선택)" maxlength="80">' : "") +
      '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;">' +
      '<label class="mnr-wl-consent"><input type="checkbox" name="consent"> ' + c.consent + "</label>" +
      '<button type="submit" class="mnr-wl-submit">' + c.submit + "</button>" +
      (c.notice ? '<p class="mnr-wl-notice">' + c.notice + "</p>" : "") +
      '<p class="mnr-wl-msg" role="status"></p>';
    host.appendChild(form);

    if (c.otp) bindOtp(form);

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

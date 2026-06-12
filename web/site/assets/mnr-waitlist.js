/* ============================================================
   Melanoir — 출시 웨이트리스트 / 베타테스터 폼 (자체 호스팅)
   사용법: <div data-mnr-waitlist data-type="customer|pro|beta"></div>
   - 유형 선택 UI 없음. 페이지가 대상을 결정한다.
   ============================================================ */
(function () {
  "use strict";

  var API_URL = "https://verify.melanoir.co.kr/api/waitlist";

  var COPY = {
    customer: {
      audience: "시술 고객 대상 — 시술자는 멜라누아 프로에서 신청하세요.",
      consent: "출시 알림 발송을 위한 개인정보(연락처) 수집·이용에 동의합니다.",
      submit: "출시 알림 받기",
      done: "정식 출시 소식을 가장 먼저 보내드릴게요.",
      shop: false, insta: false
    },
    pro: {
      audience: "시술자 대상 — 시술 고객은 멜라누아 클럽에서 신청하세요.",
      consent: "출시 알림 발송을 위한 개인정보(연락처) 수집·이용에 동의합니다.",
      submit: "출시 알림 받기",
      done: "Pro 가입 오픈 소식을 가장 먼저 보내드릴게요.",
      shop: true, insta: false
    },
    beta: {
      audience: "베타테스터 모집 — 시술 경험이 있는 전문가 대상",
      consent: "베타테스터 모집·선정 안내를 위한 개인정보(연락처·SNS 계정) 수집·이용에 동의합니다.",
      submit: "베타테스터 신청하기",
      done: "선정 결과와 안내를 문자로 보내드릴게요.",
      shop: true, insta: true
    }
  };

  function render(host) {
    var type = host.getAttribute("data-type");
    if (!COPY[type]) type = "customer";
    var c = COPY[type];

    var form = document.createElement("form");
    form.className = "mnr-wl-form";
    form.noValidate = true;
    form.innerHTML =
      '<p class="mnr-wl-audience">' + c.audience + "</p>" +
      '<input type="text" name="name" placeholder="이름 (선택)" maxlength="50" autocomplete="name">' +
      '<input type="tel" name="phone" placeholder="휴대폰 번호" maxlength="13" autocomplete="tel">' +
      (c.shop ? '<input type="text" name="shop_name" placeholder="샵 이름 (선택)" maxlength="80">' : "") +
      (c.insta ? '<input type="text" name="instagram" placeholder="인스타그램 계정 — 포트폴리오 확인용" maxlength="80" autocomplete="off">' : "") +
      '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;">' +
      '<label class="mnr-wl-consent"><input type="checkbox" name="consent"> ' + c.consent + "</label>" +
      '<button type="submit" class="mnr-wl-submit">' + c.submit + "</button>" +
      '<p class="mnr-wl-msg" role="status"></p>';
    host.appendChild(form);

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

  function submit(form, host, type, c) {
    var phone = form.querySelector('input[name="phone"]').value.replace(/-/g, "").trim();
    var consent = form.querySelector('input[name="consent"]').checked;
    var instaEl = form.querySelector('input[name="instagram"]');
    var instagram = instaEl ? instaEl.value.trim().replace(/^@/, "") : "";

    if (!/^01[0-9]{8,9}$/.test(phone)) {
      showMsg(form, "유효한 휴대폰 번호를 입력해주세요.", true);
      return;
    }
    if (c.insta && !instagram) {
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

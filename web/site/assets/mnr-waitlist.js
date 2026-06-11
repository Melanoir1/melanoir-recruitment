/* ============================================================
   Melanoir — 출시 웨이트리스트 폼 (자체 호스팅)
   사용법: <div data-mnr-waitlist data-type="customer|pro"></div>
   ============================================================ */
(function () {
  "use strict";

  var API_URL = "https://verify.melanoir.co.kr/api/waitlist";

  function render(host) {
    var defaultType = host.getAttribute("data-type") === "pro" ? "pro" : "customer";

    var form = document.createElement("form");
    form.className = "mnr-wl-form";
    form.noValidate = true;
    form.innerHTML =
      '<div class="mnr-wl-types">' +
      '<label class="mnr-wl-type"><input type="radio" name="type" value="customer"><span>시술 고객</span></label>' +
      '<label class="mnr-wl-type"><input type="radio" name="type" value="pro"><span>시술자</span></label>' +
      "</div>" +
      '<input type="text" name="name" placeholder="이름 (선택)" maxlength="50" autocomplete="name">' +
      '<input type="tel" name="phone" placeholder="휴대폰 번호" maxlength="13" autocomplete="tel">' +
      '<input type="text" name="shop_name" placeholder="샵 이름 (선택)" maxlength="80" style="display:none;">' +
      '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;">' +
      '<label class="mnr-wl-consent"><input type="checkbox" name="consent">' +
      " 출시 알림 발송을 위한 개인정보(연락처) 수집·이용에 동의합니다.</label>" +
      '<button type="submit" class="mnr-wl-submit">출시 알림 받기</button>' +
      '<p class="mnr-wl-msg" role="status"></p>';
    host.appendChild(form);

    var shopInput = form.querySelector('input[name="shop_name"]');
    var radios = form.querySelectorAll('input[name="type"]');

    function syncType() {
      var checked = form.querySelector('input[name="type"]:checked');
      shopInput.style.display = checked && checked.value === "pro" ? "" : "none";
    }
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].value === defaultType) radios[i].checked = true;
      radios[i].addEventListener("change", syncType);
    }
    syncType();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submit(form, host);
    });
  }

  function showMsg(form, text, isError) {
    var msg = form.querySelector(".mnr-wl-msg");
    msg.textContent = text;
    msg.classList.toggle("is-error", !!isError);
  }

  function submit(form, host) {
    var typeInput = form.querySelector('input[name="type"]:checked');
    var phone = form.querySelector('input[name="phone"]').value.replace(/-/g, "").trim();
    var consent = form.querySelector('input[name="consent"]').checked;

    if (!/^01[0-9]{8,9}$/.test(phone)) {
      showMsg(form, "유효한 휴대폰 번호를 입력해주세요.", true);
      return;
    }
    if (!consent) {
      showMsg(form, "개인정보 수집·이용에 동의해주세요.", true);
      return;
    }

    var btn = form.querySelector(".mnr-wl-submit");
    btn.disabled = true;
    showMsg(form, "신청 중...", false);

    var payload = {
      type: typeInput ? typeInput.value : "customer",
      phone: phone,
      name: form.querySelector('input[name="name"]').value.trim(),
      shop_name: form.querySelector('input[name="shop_name"]').value.trim(),
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
            "<p>정식 출시 소식을 가장 먼저 보내드릴게요.</p></div>";
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

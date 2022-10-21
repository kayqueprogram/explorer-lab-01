import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg >g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");
const ccBg = document.querySelector(".cc");


function setCardType(type) {
    const colors = {
        "visa": ["#436D99", "#2D57F2", "#084B8A"],
        "mastercard": ["#DF6F29", "#FFBF00", "#B45F04"],
        "nubank": ["#500061", "#991999", "#500061"],
        "default": ["black", "gray", "gray"],
    };

    ccBgColor01.setAttribute("fill", colors[type][0]);
    ccBgColor02.setAttribute("fill", colors[type][1]);
    ccLogo.setAttribute("src", `cc-${type}.svg`);
    ccBg.style.backgroundColor = (colors[type][2]);
    ccBg.style.borderRadius = "20px";

};

globalThis.setCardType = setCardType;


// Security code
const SecurityCode = document.getElementById('security-code');

const SecurityCodePattern = {
    mask: "0000",
};

const SecurityCodeMasked = IMask(SecurityCode, SecurityCodePattern);
const ExpirationDate = document.getElementById('expiration-date');
const ExpirationDatePattern = {
    mask:"MM{/}YY",
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1, 
            to: 12
        },

        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        }
    }
};

const ExpirationDateMasked = IMask(ExpirationDate, ExpirationDatePattern);

const CardNumber = document.getElementById('card-number');
const CardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa"
        },
        {
            mask: "0000 0000 0000 0000",
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard"
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^9999\d{0,12}/,
            cardtype: "nubank"
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default"
        }

    ],
    dispatch: function(appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "");
        const FoundMask = dynamicMasked.compiledMasks.find(function(item) {
            return number.match(item.regex)
        })

        console.log(FoundMask);

        return FoundMask
    }
};
const CardNumberMasked = IMask(CardNumber, CardNumberPattern);

const addButton = document.getElementById("add-card");
addButton.addEventListener('click', () => {
    alert("Cartão adicionado!");
});

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
});

const CardHolder = document.getElementById('card-holder');
CardHolder.addEventListener('input', () => {
    const ccHolder = document.querySelector('.cc-holder .value');
    ccHolder.innerHTML = CardHolder.value.length === 0 ? "USUÁRIO ALEATÓRIO": CardHolder.value;
});

SecurityCodeMasked.on('accept', () => {
    UpdateSecurityCode(SecurityCodeMasked.value);
});

function UpdateSecurityCode(code) {
    const ccSecurity = document.querySelector('.cc-security .value');
    ccSecurity.innerText = code.length === 0 ? "123": code;
};

CardNumberMasked.on('accept', () => {
    const CardType = CardNumberMasked.masked.currentMask.cardtype;
    setCardType(CardType);
    UpdateCardNumber(CardNumberMasked.value);
});

function UpdateCardNumber(number) {
    const ccNumber = document.querySelector('.cc-number');
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
};

ExpirationDateMasked.on('accept', () => {
    UpdateExpirationDate(ExpirationDateMasked.value)
});

function UpdateExpirationDate(date) {
    const ccExpiration = document.querySelector('.cc-extra .value');
    ccExpiration.innerText = date.length === 0 ? "02/32": date;
};

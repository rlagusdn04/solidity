// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCa1rKcGYEAOCVsNWcxjBwj7tkLLHPQPs",
  authDomain: "trove-28de5.firebaseapp.com",
  projectId: "trove-28de5",
  storageBucket: "trove-28de5.firebasestorage.app",
  messagingSenderId: "906681488094",
  appId: "1:906681488094:web:597d7eef813cd564c8a84f",
  measurementId: "G-KLRRLM8V3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');

// 모달 관련
const loginModal = document.getElementById('login-modal');
const openModalBtn = document.getElementById('google-login-btn');
const closeModalBtn = document.getElementById('close-modal');
const modalGoogleLoginBtn = document.getElementById('modal-google-login');
const modalPhoneLoginBtn = document.getElementById('modal-phone-login');
const modalPhoneForm = document.getElementById('modal-phone-form');
const modalCodeForm = document.getElementById('modal-code-form');
const modalPhoneMessage = document.getElementById('modal-phone-message');

// 모달 열기/닫기
openModalBtn.addEventListener('click', () => {
  loginModal.style.display = 'flex';
  modalPhoneForm.style.display = 'none';
  modalCodeForm.style.display = 'none';
  modalPhoneMessage.textContent = '';
});
closeModalBtn.addEventListener('click', () => {
  loginModal.style.display = 'none';
});

// 구글 로그인 선택
modalGoogleLoginBtn.addEventListener('click', async () => {
  loginModal.style.display = 'none';
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    alert('로그인 실패: ' + error.message);
  }
});

// 전화번호 로그인 선택
modalPhoneLoginBtn.addEventListener('click', () => {
  modalPhoneForm.style.display = 'block';
  modalCodeForm.style.display = 'none';
  modalPhoneMessage.textContent = '';
});

// reCAPTCHA verifier (모달용)
let modalRecaptchaVerifier = null;
let modalConfirmationResult = null;

function ensureModalRecaptcha() {
  if (!modalRecaptchaVerifier) {
    if (auth) {
      modalRecaptchaVerifier = new RecaptchaVerifier('modal-recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {},
      }, auth);
      modalRecaptchaVerifier.render();
    } else {
      modalPhoneMessage.textContent = '인증 시스템 초기화 중입니다. 잠시 후 다시 시도해 주세요.';
    }
  }
}
modalPhoneLoginBtn.addEventListener('click', ensureModalRecaptcha);

// 인증번호 받기
modalPhoneForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const phoneNumber = document.getElementById('modal-phone-number').value;
  try {
    modalConfirmationResult = await signInWithPhoneNumber(auth, phoneNumber, modalRecaptchaVerifier);
    modalPhoneMessage.textContent = '인증번호가 전송되었습니다.';
    modalCodeForm.style.display = 'block';
  } catch (error) {
    modalPhoneMessage.textContent = '오류: ' + error.message;
  }
});
// 인증번호 확인
modalCodeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = document.getElementById('modal-verification-code').value;
  try {
    await modalConfirmationResult.confirm(code);
    modalPhoneMessage.textContent = '로그인 성공!';
    setTimeout(() => { loginModal.style.display = 'none'; }, 800);
    modalCodeForm.style.display = 'none';
  } catch (error) {
    modalPhoneMessage.textContent = '인증 실패: ' + error.message;
  }
});


// 기존 loginBtn(google-login-btn) 클릭 시 바로 구글 로그인 실행되는 부분 제거
// loginBtn.addEventListener('click', async () => { ... }); // 이 부분 삭제 또는 주석처리
// 대신 openModalBtn(google-login-btn) 클릭 시 모달만 뜨도록 위에서 처리함

// RecaptchaVerifier 생성 시 auth가 undefined가 아니어야 함
let modalRecaptchaVerifier = null;
function ensureModalRecaptcha() {
  if (!modalRecaptchaVerifier) {
    if (auth) {
      modalRecaptchaVerifier = new RecaptchaVerifier('modal-recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {},
      }, auth);
      modalRecaptchaVerifier.render();
    } else {
      modalPhoneMessage.textContent = '인증 시스템 초기화 중입니다. 잠시 후 다시 시도해 주세요.';
    }
  }
}
modalPhoneLoginBtn.addEventListener('click', ensureModalRecaptcha);

let modalConfirmationResult = null;

// 인증번호 받기
modalPhoneForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const phoneNumber = document.getElementById('modal-phone-number').value;
  try {
    modalConfirmationResult = await signInWithPhoneNumber(auth, phoneNumber, modalRecaptchaVerifier);
    modalPhoneMessage.textContent = '인증번호가 전송되었습니다.';
    modalCodeForm.style.display = 'block';
  } catch (error) {
    modalPhoneMessage.textContent = '오류: ' + error.message;
  }
});
// 인증번호 확인
modalCodeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = document.getElementById('modal-verification-code').value;
  try {
    await modalConfirmationResult.confirm(code);
    modalPhoneMessage.textContent = '로그인 성공!';
    setTimeout(() => { loginModal.style.display = 'none'; }, 800);
    modalCodeForm.style.display = 'none';
  } catch (error) {
    modalPhoneMessage.textContent = '인증 실패: ' + error.message;
  }
});


logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert('로그아웃 실패: ' + error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userInfo.textContent = user.displayName + ' (' + user.email + ')';
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    userInfo.textContent = '';
  }
});

// 이후 db를 사용하여 Firestore 연동 코드 작성

document.getElementById('assetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const serialNumber = document.getElementById('serialNumber').value;
  const metadataURI = document.getElementById('metadataURI').value;

  // Firestore에 자산 정보 저장
  await addDoc(collection(db, 'assets'), {

    
    name,
    description,
    serialNumber,
    metadataURI,
    ownerAddress: "0x...", // 실제 메타마스크 등에서 받아오기
    status: "등록"
  });

  alert('자산이 등록되었습니다!');
  // 자산 목록 새로고침 등 추가 구현
}); 

// 전화번호 로그인 관련
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  'size': 'normal',
  'callback': (response) => {
    // reCAPTCHA solved
  }
}, auth);

const phoneLoginForm = document.getElementById('phone-login-form');
const codeVerifyForm = document.getElementById('code-verify-form');
const phoneLoginMessage = document.getElementById('phone-login-message');
let confirmationResult = null;

if (phoneLoginForm && codeVerifyForm) {
  phoneLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phoneNumber = document.getElementById('phone-number').value;
    try {
      confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      phoneLoginMessage.textContent = '인증번호가 전송되었습니다.';
      codeVerifyForm.style.display = 'block';
    } catch (error) {
      phoneLoginMessage.textContent = '오류: ' + error.message;
    }
  });

  codeVerifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('verification-code').value;
    try {
      await confirmationResult.confirm(code);
      phoneLoginMessage.textContent = '로그인 성공!';
      codeVerifyForm.style.display = 'none';
    } catch (error) {
      phoneLoginMessage.textContent = '인증 실패: ' + error.message;
    }
  });
} 
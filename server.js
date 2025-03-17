const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// users의 정보를 확인하신 후에 로그인 요청을 진행해주세요.
// server.js 파일 내에 총 5가지의 문제가 존재합니다.
// 문제의 요구사항을 꼼꼼히 읽어보신 후에 과제를 진행해주세요.
const users = [
  {
    user_id: "oz_user1",
    user_password: "1234",
    user_name: "김오즈",
    user_info: "서울에 거주하는 김오즈입니다.",
  },
  {
    user_id: "oz_user2",
    user_password: "4567",
    user_name: "박코딩",
    user_info: "부산에 거주하는 박코딩입니다.",
  },
  {
    user_id: "oz_user3",
    user_password: "7890",
    user_name: "이쿠키",
    user_info: "경기에 거주하는 이쿠키입니다.",
  },
  {
    user_id: "oz_user4",
    user_password: "1357",
    user_name: "최노드",
    user_info: "제주에 거주하는 최노드입니다.",
  },
];

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// 1️⃣. 요구사항에 맞도록 session 옵션을 설정해 주세요. (총 4가지)
app.use(
  session({
    secret: "my_secret_key", // 🔹 암호화 키 설정
    resave: false, // 🔹 변경 없으면 저장 안 함
    saveUninitialized: false, // 🔹 빈 세션 저장 안 함
    name: "session_id", // 🔹 쿠키 이름 설정
    cookie: { secure: false, httpOnly: true }, 
    // 🔹 secure: HTTPS에서만 사용, 개발 환경에서는 false
  })
);

// POST 요청 (로그인 요청시 보내는 메소드)
app.post("/", (req, res) => {
  const { user_id, user_password } = req.body;

  // 3️⃣. (find 메서드를 사용하여) users의 정보와 사용자가 입력한 정보를 비교하여 일치하는 회원이 존재하는지 확인하는 로직을 작성하세요.
  const userInfo = users.find(
    (user) => user.user_id === user_id && 
    user.user_password === user_password
  );

  if (!userInfo) {
    res.status(401).send("로그인 실패");
  } else {
    // 유저가 존재하는 경우 user의 id 정보를 세션에 저장
    req.session.userId = userInfo.user_id;
    res.send("⭐️세션 생성 완료!");
  }
});

// GET 요청
app.get("/", (req, res) => {
  const userInfo = users.find((el) => el.user_id === req.session.userId);
  // json 형식으로 내보내기
  return res.json(userInfo);
});

// DELETE 요청
app.delete("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("세션 삭제 실패");
    }
    res.clearCookie("session_id"); // ✅ 쿠키 삭제
    return res.send("🧹 세션 삭제 완료");
  }); // ✅ `req.session.destroy()`가 올바르게 닫힘
});

app.listen(3000, () => {
  console.log("🚀 서버가 http://localhost:3000 에서 실행 중 ...");
});
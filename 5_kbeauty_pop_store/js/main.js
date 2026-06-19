const products = [
  {
    id: 1,
    name: "잉크 무드 블러 틴트 05 누디로즈",
    category: "makeup",
    price: 12800,
    original: 16000,
    badges: ["HOT", "립랭킹"],
    tone: "lip"
  },
  {
    id: 2,
    name: "프로 테일러 글로우 쿠션 SPF 42",
    category: "makeup",
    price: 27800,
    original: 34000,
    badges: ["NEW", "베이스"],
    tone: "cushion"
  },
  {
    id: 3,
    name: "시카 리페어 버블 세럼 50ml",
    category: "skin",
    price: 21900,
    original: 30000,
    badges: ["SALE", "진정"],
    tone: "serum"
  },
  {
    id: 4,
    name: "워터락 선 앰플 SPF50+ PA++++",
    category: "skin",
    price: 18500,
    original: 24000,
    badges: ["HOT", "선케어"],
    tone: "sun"
  },
  {
    id: 5,
    name: "젤리 팟 블러셔 03 피치 소르베",
    category: "makeup",
    price: 9900,
    original: 14000,
    badges: ["NEW", "컬러"],
    tone: "blush"
  },
  {
    id: 6,
    name: "판테놀 장벽 크림 듀오 기획",
    category: "deal",
    price: 24800,
    original: 39000,
    badges: ["SALE", "1+1"],
    tone: "cream"
  },
  {
    id: 7,
    name: "포어 클리어 클레이 스틱",
    category: "skin",
    price: 14300,
    original: 22000,
    badges: ["SALE", "모공"],
    tone: "pore"
  },
  {
    id: 8,
    name: "아이 팔레트 미니 04 라벤더 쿼츠",
    category: "makeup",
    price: 19800,
    original: 26000,
    badges: ["HOT", "아이"],
    tone: "eye"
  }
];

const routines = {
  barrier: {
    title: "장벽 크림 + 시카 세럼 + 무기자차 선앰플",
    desc: "민감한 피부가 매일 쓰기 쉬운 저자극 3단계 루틴입니다."
  },
  calm: {
    title: "시카 버블 세럼 + 판테놀 토너 패드 + 젤 크림",
    desc: "붉어짐과 열감을 빠르게 낮추는 산뜻한 진정 루틴입니다."
  },
  glow: {
    title: "나이아신 세럼 + 글로우 쿠션 + 피치 블러셔",
    desc: "스킨케어 광채와 얇은 베이스 메이크업을 함께 제안합니다."
  },
  pore: {
    title: "클레이 스틱 + PHA 토너 + 세범 파우더",
    desc: "번들거림과 모공 요철을 매끈하게 정리하는 루틴입니다."
  }
};

const formatWon = value => `${value.toLocaleString("ko-KR")}원`;
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const toast = document.getElementById("toast");
let cart = [];

function badgeClass(label) {
  if (label === "HOT") return "hot";
  if (label === "NEW") return "new";
  if (label === "SALE" || label === "1+1") return "sale";
  return "";
}

function renderProducts(filter = "all") {
  const visible = filter === "all" ? products : products.filter(product => product.category === filter || (filter === "deal" && product.badges.includes("SALE")));
  productGrid.innerHTML = visible.map((product, index) => `
    <article class="product-card" data-category="${product.category}">
      <span class="rank">${index + 1}</span>
      <div class="product-img product-art ${product.tone}" role="img" aria-label="${product.name} 제품 이미지">
        <i></i><i></i><span>${product.name.split(" ")[0]}</span>
      </div>
      <div class="product-meta">
        ${product.badges.map(badge => `<span class="badge ${badgeClass(badge)}">${badge}</span>`).join("")}
      </div>
      <h3>${product.name}</h3>
      <div class="price-row">
        <b>${formatWon(product.price)}</b>
        <del>${formatWon(product.original)}</del>
      </div>
      <div class="buy-row">
        <button type="button" class="add-btn" data-add="${product.id}">담기</button>
        <button type="button" class="heart-btn" aria-label="${product.name} 찜하기">♡</button>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  renderCart();
  showToast(`${product.name} 상품을 담았습니다.`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== Number(id));
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = count;
  cartTotal.textContent = formatWon(total);

  if (!cart.length) {
    cartItems.innerHTML = `<p class="cart-empty">아직 담긴 상품이 없습니다.</p>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-thumb ${item.tone}" aria-hidden="true"></div>
      <div>
        <b>${item.name}</b>
        <span>${formatWon(item.price)} · ${item.qty}개</span>
      </div>
      <button type="button" data-remove="${item.id}" aria-label="${item.name} 삭제">×</button>
    </div>
  `).join("");
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) removeFromCart(removeButton.dataset.remove);

  if (event.target.closest("[data-open-cart]")) {
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
  }

  if (event.target.closest("[data-close-cart]") || event.target === cartDrawer) {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
  }

  const tab = event.target.closest(".tab");
  if (tab) {
    document.querySelectorAll(".tab").forEach(button => button.classList.remove("active"));
    tab.classList.add("active");
    renderProducts(tab.dataset.filter);
  }

  const routineButton = event.target.closest("[data-routine]");
  if (routineButton) {
    document.querySelectorAll("[data-routine]").forEach(button => button.classList.remove("active"));
    routineButton.classList.add("active");
    const routine = routines[routineButton.dataset.routine];
    document.getElementById("routineResult").innerHTML = `
      <small>추천 루틴</small>
      <strong>${routine.title}</strong>
      <p>${routine.desc}</p>
    `;
  }

  if (event.target.closest(".search-open")) {
    showToast("검색 UI는 다음 단계에서 상세 페이지와 함께 확장할 수 있습니다.");
  }
});

document.querySelector("[data-routine='barrier']").classList.add("active");
renderProducts();
renderCart();

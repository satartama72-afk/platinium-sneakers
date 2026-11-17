document.addEventListener("DOMContentLoaded", function () {
    // ========================================
    // 1. SLIDER BANNER
    // ========================================

    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");
    const prevBtn = document.querySelector(".hero-arrow.prev");
    const nextBtn = document.querySelector(".hero-arrow.next");
    const slider = document.querySelector(".hero-slider");

    if (slides.length > 0) {
        let currentSlide = 0;
        let autoSlide;

        function showSlide(index) {
            currentSlide = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === currentSlide);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === currentSlide);
            });
        }

        function startAutoSlide() {
            clearInterval(autoSlide);
            autoSlide = setInterval(function () {
                showSlide(currentSlide + 1);
            }, 4000);
        }

        nextBtn?.addEventListener("click", function () {
            showSlide(currentSlide + 1);
            startAutoSlide();
        });

        prevBtn?.addEventListener("click", function () {
            showSlide(currentSlide - 1);
            startAutoSlide();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", function () {
                showSlide(index);
                startAutoSlide();
            });
        });

        slider?.addEventListener("mouseenter", function () {
            clearInterval(autoSlide);
        });

        slider?.addEventListener("mouseleave", startAutoSlide);

        showSlide(0);
        startAutoSlide();
    }


    // ========================================
    // 2. LOGIN / MASUK SEKARANG
    // ========================================

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const forgotPassword = document.getElementById("forgotPassword");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const passwordHidden = passwordInput.type === "password";

            passwordInput.type = passwordHidden ? "text" : "password";
            togglePassword.textContent = passwordHidden
                ? "Sembunyi"
                : "Lihat";
        });
    }

    if (loginForm && usernameInput && passwordInput) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username || !password) {
                alert("Username dan password wajib diisi!");
                return;
            }

            window.location.href = "./home.html";
        });
    }

    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Fitur lupa password belum tersedia.");
        });
    }


    // ========================================
    // 3. PENDAFTARAN / DAFTAR SEKARANG
    // ========================================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const newPassword =
                document.getElementById("newPassword")?.value || "";

            const confirmPassword =
                document.getElementById("confirmPassword")?.value || "";

            if (newPassword.length < 8) {
                alert("Password minimal 8 karakter.");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("Konfirmasi password tidak cocok!");
                return;
            }

            alert(
                "Validasi pendaftaran berhasil. " +
                "Akun belum tersimpan karena backend belum terhubung."
            );
        });
    }


    
    // ========================================
    // 4. KATALOG PRODUK DARI ADMIN
    // ========================================

    (function () {
        "use strict";

        const STORAGE_KEY = "platiniumProduk";

        function readProducts() {
            try {
                const data = JSON.parse(
                    localStorage.getItem(STORAGE_KEY) || "[]"
                );

                return Array.isArray(data) ? data : [];
            } catch (error) {
                console.error("Gagal membaca data produk:", error);
                return [];
            }
        }

        function formatPrice(price) {
            const amount = Number(price) || 0;

            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }).format(amount);
        }

        function escapeHTML(value) {
            return String(value ?? "").replace(/[&<>"']/g, function (char) {
                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                }[char];
            });
        }

        function getProductTitle(product) {
            return product.title || product.name || "Sneakers";
        }

        function getProductImage(product) {
            return product.image || product.imageUrl || "";
        }

        function getProductPrice(product) {
            return Number(product.price) || 0;
        }

        function initProductCatalog() {
            const catalog = document.getElementById("productCatalog");

            // Jangan menjalankan katalog pada halaman yang tidak memilikinya.
            if (!catalog) return;

            const emptyMessage = document.getElementById("emptyProducts");
            const noResultsMessage =
                document.getElementById("noSearchResults");

            const searchInput =
                document.getElementById("productSearch");

            const categoryFilter =
                document.getElementById("categoryFilter");

            const sortFilter =
                document.getElementById("sortFilter");

            const modal =
                document.getElementById("productDetailModal");

            const modalContent =
                document.getElementById("productDetailContent");

            const closeModalButton =
                document.getElementById("closeProductModal");

            let products = [];
            let selectedProduct = null;

            function updateCategoryOptions() {
                if (!categoryFilter) return;

                const selectedCategory = categoryFilter.value;

                const categories = [
                    ...new Set(
                        products
                            .map(function (product) {
                                return product.category || "Sneakers";
                            })
                            .filter(Boolean)
                    )
                ].sort(function (a, b) {
                    return a.localeCompare(b, "id");
                });

                categoryFilter.replaceChildren();

                const allOption = document.createElement("option");
                allOption.value = "";
                allOption.textContent = "Semua Kategori";
                categoryFilter.appendChild(allOption);

                categories.forEach(function (category) {
                    const option = document.createElement("option");
                    option.value = category;
                    option.textContent = category;
                    categoryFilter.appendChild(option);
                });

                if (
                    [...categoryFilter.options].some(function (option) {
                        return option.value === selectedCategory;
                    })
                ) {
                    categoryFilter.value = selectedCategory;
                }
            }

            function getFilteredProducts() {
                const keyword = searchInput
                    ? searchInput.value.trim().toLowerCase()
                    : "";

                const category = categoryFilter
                    ? categoryFilter.value
                    : "";

                const sort = sortFilter ? sortFilter.value : "";

                let result = products.filter(function (product) {
                    const title = getProductTitle(product).toLowerCase();
                    const description =
                        String(product.description || "").toLowerCase();
                    const productCategory =
                        product.category || "Sneakers";

                    const matchesKeyword =
                        title.includes(keyword) ||
                        description.includes(keyword) ||
                        productCategory.toLowerCase().includes(keyword);

                    const matchesCategory =
                        !category || productCategory === category;

                    return matchesKeyword && matchesCategory;
                });

                if (sort === "price-low") {
                    result.sort(function (a, b) {
                        return getProductPrice(a) - getProductPrice(b);
                    });
                } else if (sort === "price-high") {
                    result.sort(function (a, b) {
                        return getProductPrice(b) - getProductPrice(a);
                    });
                } else if (sort === "name") {
                    result.sort(function (a, b) {
                        return getProductTitle(a).localeCompare(
                            getProductTitle(b),
                            "id"
                        );
                    });
                } else {
                    result.sort(function (a, b) {
                        return (
                            new Date(b.createdAt || 0) -
                            new Date(a.createdAt || 0)
                        );
                    });
                }

                return result;
            }

            function createProductCard(product, index) {
                const card = document.createElement("article");
                card.className = "produk-card product-card";

                const image = getProductImage(product);
                const title = getProductTitle(product);
                const category = product.category || "Sneakers";
                const description = product.description || "";

                const imageMarkup = image
                    ? `<img
                            class="produk-card-image"
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(title)}"
                            loading="lazy"
                        >`
                    : `<div class="produk-card-placeholder">
                            <span>PLATINIUM SNEAKERS</span>
                        </div>`;

                card.innerHTML = `
                    ${imageMarkup}
                    <div class="produk-card-body product-card-body">
                        <span class="produk-card-category product-category">
                            ${escapeHTML(category)}
                        </span>
                        <h3 class="produk-card-title">
                            ${escapeHTML(title)}
                        </h3>
                        <p class="produk-card-description product-description">
                            ${escapeHTML(description)}
                        </p>
                        <div class="produk-card-bottom">
                            <strong class="produk-card-price product-price">
                                ${formatPrice(getProductPrice(product))}
                            </strong>
                            <button
                                type="button"
                                class="produk-detail-button"
                                data-product-index="${index}"
                            >
                                Lihat Detail
                            </button>
                        </div>
                    </div>
                `;

                const img = card.querySelector("img");

                if (img) {
                    img.addEventListener("error", function () {
                        const placeholder =
                            document.createElement("div");

                        placeholder.className =
                            "produk-card-placeholder";

                        placeholder.textContent = "PLATINIUM SNEAKERS";
                        img.replaceWith(placeholder);
                    });
                }

                return card;
            }

            function renderProducts() {
                products = readProducts();
                updateCategoryOptions();

                const filteredProducts = getFilteredProducts();

                catalog.replaceChildren();

                if (emptyMessage) {
                    emptyMessage.hidden = products.length !== 0;
                }

                if (noResultsMessage) {
                    noResultsMessage.hidden =
                        products.length === 0 ||
                        filteredProducts.length !== 0;
                }

                if (products.length === 0) {
                    return;
                }

                filteredProducts.forEach(function (product) {
                    catalog.appendChild(
                        createProductCard(
                            product,
                            products.indexOf(product)
                        )
                    );
                });
            }

            function openProductDetail(product) {
                if (!modal || !modalContent) {
                    // Jika HTML tidak menyediakan modal, tetap tampilkan detail.
                    alert(
                        getProductTitle(product) +
                        "\nHarga: " + formatPrice(getProductPrice(product)) +
                        "\n\n" + (product.description || "Tidak ada deskripsi.")
                    );
                    return;
                }

                selectedProduct = product;

                const image = getProductImage(product);
                const title = getProductTitle(product);

                modalContent.innerHTML = `
                    ${
                        image
                            ? `<img
                                class="produk-detail-image"
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(title)}"
                            >`
                            : ""
                    }
                    <span class="produk-detail-category">
                        ${escapeHTML(product.category || "Sneakers")}
                    </span>
                    <h2>${escapeHTML(title)}</h2>
                    <p class="produk-detail-price">
                        ${formatPrice(getProductPrice(product))}
                    </p>
                    <p class="produk-detail-description">
                        ${escapeHTML(
                            product.description ||
                            "Belum ada deskripsi produk."
                        )}
                    </p>
                `;

                modal.hidden = false;
                modal.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden";

                const detailImage = modalContent.querySelector("img");

                if (detailImage) {
                    detailImage.addEventListener("error", function () {
                        detailImage.hidden = true;
                    });
                }
            }

            function closeProductDetail() {
                if (!modal) return;

                modal.hidden = true;
                modal.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "";
                selectedProduct = null;
            }

            // Pencarian dan filter.
            searchInput?.addEventListener("input", renderProducts);
            categoryFilter?.addEventListener("change", renderProducts);
            sortFilter?.addEventListener("change", renderProducts);

            // Tombol detail produk menggunakan event delegation.
            catalog.addEventListener("click", function (event) {
                const button = event.target.closest(
                    "[data-product-index]"
                );

                if (!button || !catalog.contains(button)) return;

                const index = Number(button.dataset.productIndex);
                const product = products[index];

                if (product) {
                    openProductDetail(product);
                }
            });

            closeModalButton?.addEventListener(
                "click",
                closeProductDetail
            );

            // Tutup modal saat latar modal diklik.
            modal?.addEventListener("click", function (event) {
                if (event.target === modal) {
                    closeProductDetail();
                }
            });

            // Tutup modal dengan tombol Escape.
            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    closeProductDetail();
                }
            });

            // Muat ulang jika data berubah dari tab admin lain.
            window.addEventListener("storage", function (event) {
                if (
                    event.key === STORAGE_KEY ||
                    event.key === null
                ) {
                    renderProducts();
                }
            });

            // Muat ulang saat pengguna kembali ke halaman.
            document.addEventListener("visibilitychange", function () {
                if (!document.hidden) {
                    renderProducts();
                }
            });

            // Render pertama kali.
            renderProducts();
        }

        if (document.readyState === "loading") {
            document.addEventListener(
                "DOMContentLoaded",
                initProductCatalog
            );
          } else {
            initProductCatalog();
        }
    })();

    });

    // ========================================
    // 5. BANNER LAMA
    // ========================================

    function loadAdminBannerToHome() {
        const saved = localStorage.getItem("platinum_banner_config");

    if (!saved) return;

    let banner;

    try {
        banner = JSON.parse(saved);
    } catch (error) {
        console.error("Data banner tidak valid:", error);
        return;
    }

    const slide = document.querySelector(".hero-slide.active") ||
                  document.querySelector(".hero-slide");

    if (!slide) return;

    const title = slide.querySelector(".hero-title") ||
                  slide.querySelector("h1");

    const description = slide.querySelector(".hero-description") ||
                        slide.querySelector("p");

    const button = slide.querySelector(".hero-button") ||
                   slide.querySelector("a");

    if (title && banner.title) {
        title.textContent = banner.title;
    }

    if (description && banner.description) {
        description.textContent = banner.description;
    }

    if (button) {
        button.textContent = banner.buttonText || "Lihat Brand Kami";
        button.href = banner.buttonLink || "galeri.html";
    }

    const overlay = Math.max(
        0,
        Math.min(90, Number(banner.overlay) || 0)
    ) / 100;

    const image = banner.image || "";

    if (image) {
        slide.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,${overlay}), rgba(0,0,0,${overlay})), url("${image}")`;

        slide.style.backgroundSize = "cover";
        slide.style.backgroundPosition = "center";
    }
    }


    // ==========================================
    // 6. HUBUNGKAN BANNER ADMIN KE HOMEPAGE
    // ==========================================

    (function () {
        "use strict";

    const STORAGE_KEY = "platiniumBanners";

    function applyHomeBanners() {
        const slider = document.getElementById("heroSlider");
        if (!slider) return;

        let banners;

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;

            banners = JSON.parse(saved);
        } catch (error) {
            console.error("Gagal membaca data banner:", error);
            return;
        }

        if (!Array.isArray(banners)) return;

        const slides = slider.querySelectorAll(".hero-slide");

        slides.forEach(function (slide, index) {
            const banner = banners[index];
            if (!banner) return;

            const heading = slide.querySelector(".hero-content h1");
            const description = slide.querySelector(".hero-content p");
            const button = slide.querySelector(".hero-content .hero-btn");
            const overlay = slide.querySelector(".hero-overlay");

            if (heading && typeof banner.title === "string") {
                heading.textContent = banner.title;
                heading.style.whiteSpace = "pre-line";
            }

            if (description && typeof banner.description === "string") {
                description.textContent = banner.description;
            }

            if (button) {
                if (typeof banner.buttonText === "string") {
                    button.textContent = banner.buttonText;
                }

                if (typeof banner.buttonLink === "string") {
                    button.setAttribute(
                        "href",
                        banner.buttonLink.trim() || "#"
                    );
                }
            }

            if (typeof banner.image === "string" && banner.image.trim()) {
                slide.style.backgroundImage =
                    "url(" + JSON.stringify(banner.image.trim()) + ")";
            }

            if (overlay) {
                const value = Number(banner.overlay ?? 35);
                const darkness = Math.max(0, Math.min(100, value)) / 100;

                overlay.style.backgroundColor =
                    "rgba(0, 0, 0, " + darkness + ")";

                overlay.style.opacity = "1";
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyHomeBanners);
    } else {
        applyHomeBanners();
    }

    window.addEventListener("storage", function (event) {
        if (event.key === STORAGE_KEY || event.key === null) {
            applyHomeBanners();
        }
    });
    })();


    // ==========================================
    // 7. GALERI DARI ADMIN
    // ==========================================

    (function () {
    "use strict";

    const STORAGE_KEY = "platiniumGaleri";
    const OLD_STORAGE_KEY = "platinium_admin_galeri";

    function bacaDataGaleri() {
        try {
            const dataBaru = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            if (Array.isArray(dataBaru) && dataBaru.length > 0) {
                return dataBaru;
            }

            const dataLama = JSON.parse(
                localStorage.getItem(OLD_STORAGE_KEY) || "[]"
            );

            return Array.isArray(dataLama) ? dataLama : [];
        } catch (error) {
            console.error("Gagal membaca data galeri:", error);
            return [];
        }
    }

    function tampilkanGaleriAdmin() {
        const container = document.getElementById("adminGalleryItems");
        const emptyMessage = document.getElementById("galleryEmptyMessage");

        if (!container) return;

        const items = bacaDataGaleri();
        container.replaceChildren();

        items.forEach(function (item) {
            if (!item || typeof item !== "object") return;

            const card = document.createElement("article");
            card.className = "gallery-page-card";

            if (item.image) {
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.title || "Koleksi sneakers";
                img.loading = "lazy";

                img.addEventListener("error", function () {
                    img.style.display = "none";
                });

                card.appendChild(img);
            }

            const info = document.createElement("div");
            info.className = "gallery-page-info";

            const category = document.createElement("span");
            category.textContent = "KOLEKSI ADMIN";

            const title = document.createElement("h3");
            title.textContent = item.title || "Koleksi Sneakers";

            const description = document.createElement("p");
            description.textContent = item.description || "";

            info.append(category, title, description);
            card.appendChild(info);
            container.appendChild(card);
        });

        if (emptyMessage) {
            emptyMessage.style.display =
                container.children.length > 0 ? "none" : "block";
        }

        console.log("Jumlah item galeri:", items.length);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", tampilkanGaleriAdmin);
    } else {
        tampilkanGaleriAdmin();
    }

    window.addEventListener("storage", function (event) {
        if (
            event.key === STORAGE_KEY ||
            event.key === OLD_STORAGE_KEY ||
            event.key === null
        ) {
            tampilkanGaleriAdmin();
        }
    });

    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) {
            tampilkanGaleriAdmin();
        }
    });
    })();


    // ==========================================
    // 8. BLOG DARI ADMIN
    // ==========================================

    (function () {
    "use strict";

    function tampilkanBlogAdmin() {
        const container = document.getElementById("adminBlogItems");
        if (!container) return;

        let articles = [];

        try {
            articles = JSON.parse(
                localStorage.getItem("platiniumBlog") || "[]"
            );

            if (!Array.isArray(articles)) articles = [];
        } catch (error) {
            console.error("Gagal membaca data blog:", error);
            articles = [];
        }

        container.replaceChildren();

        articles.forEach(function (article) {
            if (!article || typeof article !== "object") return;

            const card = document.createElement("article");
            card.className = "blog-card";

            if (article.image) {
                const img = document.createElement("img");
                img.src = article.image;
                img.alt = article.title || "Artikel blog";
                img.loading = "lazy";

                img.addEventListener("error", function () {
                    img.style.display = "none";
                });

                card.appendChild(img);
            }

            const content = document.createElement("div");
            content.className = "blog-card-content";

            const title = document.createElement("h3");
            title.textContent = article.title || "Tanpa Judul";

            const description = document.createElement("p");
            description.textContent = article.description || "";

            content.append(title, description);
            card.appendChild(content);
            container.appendChild(card);
        });

        console.log("Jumlah artikel blog:", articles.length);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", tampilkanBlogAdmin);
    } else {
        tampilkanBlogAdmin();
    }

    window.addEventListener("storage", function (event) {
        if (event.key === "platiniumBlog" || event.key === null) {
            tampilkanBlogAdmin();
        }
    });
})();
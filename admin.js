
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // ==========================================
    // KONFIGURASI ADMIN
    // ==========================================
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    // ==========================================
    // HELPER LOCAL STORAGE
    // ==========================================
    function readStorage(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data !== null ? JSON.parse(data) : fallback;
        } catch (error) {
            console.error("Gagal membaca storage:", key, error);
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Gagal menyimpan storage:", key, error);
            alert("Data gagal disimpan. Periksa penyimpanan browser.");
            return false;
        }
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    // ==========================================
    // LOGIN DAN DASHBOARD
    // ==========================================
    const adminLogin = getElement("adminLogin");
    const adminDashboard = getElement("adminDashboard");
    const adminLoginForm = getElement("adminLoginForm");
    const loginError = getElement("loginError");
    const logoutButton = getElement("logoutButton");
    const pageTitle = getElement("pageTitle");

    function showDashboard() {
        if (adminLogin) adminLogin.hidden = true;
        if (adminDashboard) adminDashboard.hidden = false;
        showSection("overview");
    }

    if (sessionStorage.getItem("platiniumAdminLoggedIn") === "true") {
        showDashboard();
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = getElement("adminUsername")?.value.trim() || "";
            const password = getElement("adminPassword")?.value || "";

            if (
                username === ADMIN_USERNAME &&
                password === ADMIN_PASSWORD
            ) {
                sessionStorage.setItem("platiniumAdminLoggedIn", "true");

                if (loginError) loginError.textContent = "";

                showDashboard();
            } else if (loginError) {
                loginError.textContent = "Username atau password salah.";
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            sessionStorage.removeItem("platiniumAdminLoggedIn");

            if (adminDashboard) adminDashboard.hidden = true;
            if (adminLogin) adminLogin.hidden = false;

            adminLoginForm?.reset();
        });
    }

    // ==========================================
    // DATA DEFAULT 4 BANNER
    // ==========================================
    const defaultBanners = [
        {
            title: "Collection Kami",
            description: "Memiliki Berbagai Macam Jenis Sepatu Di Toko Atau Tempat Kami",
            buttonText: "Klik Disini",
            buttonLink: "galeri.html",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
            overlay: 35
        },
        {
            title: "Berbagai Brand Ternama",
            description: "Seperti Brand Nike, Adidas, Puma, New Balance",
            buttonText: "Lihat Brand Kami",
            buttonLink: "produk.html",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
            overlay: 35
        },
        {
            title: "Kami Tidak Hanya Menjual Sneakers Saja",
            description: "Kami juga menjual baju, celana, topi, sandal dan lainnya",
            buttonText: "Cari Yang Lain",
            buttonLink: "produk.html",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
            overlay: 35
        },
        {
            title: "Anda Puas Kami Puas",
            description: "Apabila Anda senang dengan barang kami, jangan lupa beri rating pada toko dan pelayanan kami",
            buttonText: "Rating",
            buttonLink: "contact.html",
            image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1600&q=80",
            overlay: 35
        }
    ];

    function loadBanners() {
        const saved = readStorage("platiniumBanners", []);
        const validSaved = Array.isArray(saved) ? saved : [];

        return defaultBanners.map((defaultBanner, index) => ({
            ...defaultBanner,
            ...(validSaved[index] && typeof validSaved[index] === "object"
                ? validSaved[index]
                : {})
        }));
    }

    let banners = loadBanners();
    let activeBannerIndex = 0;

    // Isi default hanya jika belum tersedia.
    if (localStorage.getItem("platiniumBanners") === null) {
        writeStorage("platiniumBanners", banners);
    }

    // ==========================================
    // FORM DAN PREVIEW BANNER
    // ==========================================
    const bannerForm = getElement("bannerForm");
    const bannerSelector = getElement("bannerNumber");
    const bannerTitle = getElement("bannerTitle");
    const bannerDescription = getElement("bannerDescription");
    const bannerButtonText = getElement("bannerButtonText");
    const bannerButtonLink = getElement("bannerButtonLink");
    const bannerImage = getElement("bannerImage");
    const bannerOverlay = getElement("bannerOverlay");
    const overlayLabel = getElement("overlayLabel");
    const bannerStatus = getElement("bannerStatus");
    const resetBanner = getElement("resetBanner");

    const previewTitle = getElement("previewTitle");
    const previewDescription = getElement("previewDescription");
    const previewButton = getElement("previewButton");
    const bannerPreview = getElement("bannerPreview");

    function updateBannerPreview() {
        if (previewTitle) {
            previewTitle.textContent = bannerTitle?.value || "";
        }

        if (previewDescription) {
            previewDescription.textContent = bannerDescription?.value || "";
        }

        if (previewButton) {
            previewButton.textContent = bannerButtonText?.value || "";
            previewButton.href = bannerButtonLink?.value.trim() || "#";
        }

        const overlay = Math.max(
            0,
            Math.min(90, Number(bannerOverlay?.value ?? 35))
        );

        if (overlayLabel) {
            overlayLabel.textContent = "Kegelapan: " + overlay + "%";
        }

        if (bannerPreview) {
            const image = bannerImage?.value.trim() || "";

            bannerPreview.style.backgroundImage = image
                ? `linear-gradient(rgba(0,0,0,${overlay / 100}), rgba(0,0,0,${overlay / 100})), url("${image.replace(/["\\]/g, "")}")`
                : "none";

            bannerPreview.style.backgroundSize = "cover";
            bannerPreview.style.backgroundPosition = "center";
            bannerPreview.style.color = "#fff";
            bannerPreview.style.minHeight = "250px";
            bannerPreview.style.padding = "35px";
        }
    }

    function refreshBannerSelector() {
        if (!bannerSelector) return;

        bannerSelector.replaceChildren();

        banners.forEach((banner, index) => {
            const option = document.createElement("option");
            option.value = String(index);
            option.textContent =
                "Banner " + (index + 1) + " - " +
                (banner.title || "Tanpa Judul");

            bannerSelector.appendChild(option);
        });

        bannerSelector.value = String(activeBannerIndex);
    }

    function renderBannerForm(index) {
        activeBannerIndex = Math.max(
            0,
            Math.min(banners.length - 1, Number(index) || 0)
        );

        const banner = banners[activeBannerIndex];
        if (!banner) return;

        if (bannerTitle) bannerTitle.value = banner.title || "";
        if (bannerDescription) bannerDescription.value = banner.description || "";
        if (bannerButtonText) bannerButtonText.value = banner.buttonText || "";
        if (bannerButtonLink) bannerButtonLink.value = banner.buttonLink || "";
        if (bannerImage) bannerImage.value = banner.image || "";
        if (bannerOverlay) bannerOverlay.value = banner.overlay ?? 35;

        refreshBannerSelector();
        updateBannerPreview();

        if (bannerStatus) bannerStatus.textContent = "";
    }

    bannerSelector?.addEventListener("change", function () {
        renderBannerForm(this.value);
    });

    [
        bannerTitle,
        bannerDescription,
        bannerButtonText,
        bannerButtonLink,
        bannerImage,
        bannerOverlay
    ].forEach(element => {
        element?.addEventListener("input", updateBannerPreview);
    });

    if (bannerForm) {
        bannerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            banners[activeBannerIndex] = {
                title: bannerTitle?.value.trim() || "",
                description: bannerDescription?.value.trim() || "",
                buttonText: bannerButtonText?.value.trim() || "",
                buttonLink: bannerButtonLink?.value.trim() || "#",
                image: bannerImage?.value.trim() || "",
                overlay: Math.max(
                    0,
                    Math.min(90, Number(bannerOverlay?.value ?? 35))
                )
            };

            if (writeStorage("platiniumBanners", banners)) {
                refreshBannerSelector();
                renderBannerForm(activeBannerIndex);

                if (bannerStatus) {
                    bannerStatus.textContent =
                        "Banner " + (activeBannerIndex + 1) +
                        " berhasil disimpan.";
                }

                updateCounts();
            }
        });
    }

    resetBanner?.addEventListener("click", function () {
        if (!confirm("Reset perubahan pada banner ini?")) return;

        banners[activeBannerIndex] = {
            ...defaultBanners[activeBannerIndex]
        };

        if (writeStorage("platiniumBanners", banners)) {
            renderBannerForm(activeBannerIndex);

            if (bannerStatus) {
                bannerStatus.textContent = "Banner berhasil direset.";
            }

            updateCounts();
        }
    });

    refreshBannerSelector();
    renderBannerForm(0);

    // ==========================================
    // KONFIGURASI PRODUK, BLOG, DAN GALERI
    // ==========================================
    const contentKeys = {
        produk: "platiniumProduk",
        blog: "platiniumBlog",
        galeri: "platiniumGaleri"
    };

    const managerSettings = {
        produk: {
            title: "Kelola Produk",
            description: "Kelola koleksi produk sneakers.",
            titleLabel: "Nama Produk",
            descriptionLabel: "Deskripsi Produk",
            imageLabel: "URL Gambar Produk",
            button: "Tambahkan Produk",
            price: true,
            description: true,
            image: true
        },
        blog: {
            title: "Kelola Blog",
            description: "Tambah dan kelola artikel blog.",
            titleLabel: "Judul Artikel",
            descriptionLabel: "Isi Artikel",
            imageLabel: "URL Gambar Artikel",
            button: "Tambahkan Artikel",
            price: false,
            description: true,
            image: true
        },
        galeri: {
            title: "Kelola Galeri",
            description: "Tambah dan kelola foto galeri.",
            titleLabel: "Nama Foto",
            descriptionLabel: "Keterangan Foto",
            imageLabel: "URL Foto",
            button: "Tambahkan Foto",
            price: false,
            description: true,
            image: true
        }
    };

    let currentType = "produk";

    const contentForm = getElement("contentForm");
    const editId = getElement("editId");
    const itemTitle = getElement("itemTitle");
    const itemDescription = getElement("itemDescription");
    const itemImage = getElement("itemImage");
    const itemPrice = getElement("itemPrice");
    const itemCategory = getElement("itemCategory");
    const itemImagePreview = getElement("itemImagePreview");
    const contentList = getElement("contentList");
    const managerTitle = getElement("managerTitle");
    const managerDescription = getElement("managerDescription");
    const titleLabel = getElement("titleLabel");
    const descriptionLabel = getElement("descriptionLabel");
    const imageLabel = getElement("imageLabel");
    const saveButton = getElement("saveButton");
    const cancelEdit = getElement("cancelEdit");
    const contentStatus = getElement("contentStatus");
    const productFields = getElement("productFields");
    const descriptionField = getElement("descriptionField");
    const listTitle = getElement("contentListTitle");

    function getItems(type) {
        const items = readStorage(contentKeys[type], []);
        return Array.isArray(items) ? items : [];
    }

    function configureManager() {
        const settings = managerSettings[currentType];
        if (!settings) return;

        if (managerTitle) managerTitle.textContent = settings.title;
        if (managerDescription) {
            managerDescription.textContent = settings.description;
        }
        if (titleLabel) titleLabel.textContent = settings.titleLabel;
        if (descriptionLabel) {
            descriptionLabel.textContent = settings.descriptionLabel;
        }
        if (imageLabel) imageLabel.textContent = settings.imageLabel;

        if (saveButton) {
            saveButton.textContent = editId?.value
                ? "Simpan Perubahan"
                : settings.button;
        }

        if (productFields) productFields.hidden = !settings.price;
        if (descriptionField) {
            descriptionField.hidden = !settings.description;
        }

        // Sembunyikan field harga dan kategori selain pada produk.
        if (itemPrice) {
            itemPrice.required = settings.price;
        }
        if (itemCategory) {
            itemCategory.required = settings.price;
        }

        if (listTitle) {
            listTitle.textContent =
                "Daftar " +
                currentType.charAt(0).toUpperCase() +
                currentType.slice(1);
        }
    }

    // ==========================================
    // PREVIEW GAMBAR PRODUK / BLOG / GALERI
    // ==========================================
    if (itemImage && itemImagePreview) {
        itemImage.addEventListener("input", function () {
            const url = itemImage.value.trim();

            itemImagePreview.hidden = !url;
            itemImagePreview.removeAttribute("src");

            if (url) itemImagePreview.src = url;
        });

        itemImagePreview.addEventListener("error", function () {
            itemImagePreview.hidden = true;
        });

        itemImagePreview.addEventListener("load", function () {
            itemImagePreview.hidden = false;
        });
    }

    // ==========================================
    // RESET FORM
    // ==========================================
    function resetContentForm() {
        contentForm?.reset();

        if (editId) editId.value = "";
        if (cancelEdit) cancelEdit.hidden = true;

        if (itemImagePreview) {
            itemImagePreview.hidden = true;
            itemImagePreview.removeAttribute("src");
        }

        if (contentStatus) contentStatus.textContent = "";

        configureManager();
    }

    // ==========================================
    // TAMBAH DAN EDIT PRODUK / BLOG / GALERI
    // ==========================================
    if (contentForm) {
        contentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const settings = managerSettings[currentType];
            if (!settings) return;

            const items = getItems(currentType);
            const editingId = editId?.value || "";
            const id = editingId || String(Date.now());

            const item = {
                id: id,
                title: itemTitle?.value.trim() || "",
                description: itemDescription?.value.trim() || "",
                image: itemImage?.value.trim() || "",
                price: settings.price
                    ? Number(itemPrice?.value || 0)
                    : 0,
                category: settings.price
                    ? itemCategory?.value || ""
                    : "",
                createdAt: new Date().toISOString()
            };

            if (!item.title) {
                if (contentStatus) {
                    contentStatus.textContent = "Nama atau judul wajib diisi.";
                }
                return;
            }

            if (settings.price && itemPrice?.value === "") {
                if (contentStatus) {
                    contentStatus.textContent = "Harga produk wajib diisi.";
                }
                itemPrice?.focus();
                return;
            }

            const index = items.findIndex(
                existing => String(existing.id) === String(id)
            );

            if (index >= 0) {
                // Pertahankan data lain dan tanggal pembuatan asli.
                item.createdAt = items[index].createdAt || item.createdAt;
                items[index] = { ...items[index], ...item };
            } else {
                items.unshift(item);
            }

            if (writeStorage(contentKeys[currentType], items)) {
                resetContentForm();

                if (contentStatus) {
                    contentStatus.textContent = index >= 0
                        ? "Data berhasil diperbarui."
                        : "Data berhasil ditambahkan.";
                }

                renderContent();
                updateCounts();
            }
        });
    }

    // ==========================================
    // TAMPILKAN DAFTAR PRODUK / BLOG / GALERI
    // ==========================================
    function renderContent() {
        if (!contentList) return;

        const items = getItems(currentType);
        contentList.replaceChildren();

        if (items.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "Belum ada data.";
            contentList.appendChild(empty);
            return;
        }

        items.forEach(item => {
            const card = document.createElement("article");
            card.className = "admin-content-item";

            if (item.image) {
                const image = document.createElement("img");
                image.src = item.image;
                image.alt = item.title || "Gambar";
                image.loading = "lazy";
                image.style.maxWidth = "120px";
                image.style.maxHeight = "100px";
                image.style.objectFit = "cover";

                image.addEventListener("error", function () {
                    image.hidden = true;
                });

                card.appendChild(image);
            }

            const heading = document.createElement("h4");
            heading.textContent = item.title || "Tanpa Judul";
            card.appendChild(heading);

            if (currentType === "produk") {
                const price = document.createElement("p");
                price.textContent =
                    "Harga: Rp " +
                    Number(item.price || 0).toLocaleString("id-ID");
                card.appendChild(price);

                const category = document.createElement("p");
                category.textContent = "Kategori: " + (item.category || "-");
                card.appendChild(category);
            }

            if (item.description) {
                const description = document.createElement("p");
                description.textContent = item.description;
                card.appendChild(description);
            }

            const actions = document.createElement("div");
            actions.className = "admin-form-actions";

            // TOMBOL EDIT
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "admin-secondary";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function () {
                if (editId) editId.value = String(item.id);
                if (itemTitle) itemTitle.value = item.title || "";
                if (itemDescription) {
                    itemDescription.value = item.description || "";
                }
                if (itemImage) itemImage.value = item.image || "";
                if (itemPrice) itemPrice.value = item.price ?? "";
                if (itemCategory) {
                    itemCategory.value = item.category || "Running";
                }

                if (itemImagePreview) {
                    itemImagePreview.hidden = !item.image;
                    itemImagePreview.src = item.image || "";
                }

                if (cancelEdit) cancelEdit.hidden = false;

                configureManager();

                if (saveButton) {
                    saveButton.textContent = "Simpan Perubahan";
                }

                if (contentStatus) {
                    contentStatus.textContent =
                        "Sedang mengedit: " + (item.title || "");
                }

                contentForm?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            // TOMBOL HAPUS
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "admin-logout";
            deleteButton.textContent = "Hapus";

            deleteButton.addEventListener("click", function () {
                if (!confirm(
                    'Yakin ingin menghapus "' +
                    (item.title || "data ini") + '"?'
                )) {
                    return;
                }

                const updated = getItems(currentType).filter(
                    existing =>
                        String(existing.id) !== String(item.id)
                );

                if (writeStorage(contentKeys[currentType], updated)) {
                    if (editId?.value === String(item.id)) {
                        resetContentForm();
                    }

                    renderContent();
                    updateCounts();
                }
            });

            actions.append(editButton, deleteButton);
            card.appendChild(actions);
            contentList.appendChild(card);
        });
    }

    cancelEdit?.addEventListener("click", resetContentForm);

    // ==========================================
    // NAVIGASI MENU ADMIN
    // ==========================================
    function showSection(name) {
        const overview = getElement("overviewSection");
        const banner = getElement("bannerSection");
        const manager = getElement("managerSection");

        if (overview) overview.hidden = name !== "overview";
        if (banner) banner.hidden = name !== "banner";

        if (manager) {
            manager.hidden = !["produk", "blog", "galeri"].includes(name);
        }

        document.querySelectorAll(".admin-nav").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.section === name
            );
        });

        const titles = {
            overview: "Dashboard",
            banner: "Kelola Banner",
            produk: "Kelola Produk",
            blog: "Kelola Blog",
            galeri: "Kelola Galeri"
        };

        if (pageTitle) pageTitle.textContent = titles[name] || "Dashboard";

        if (["produk", "blog", "galeri"].includes(name)) {
            if (currentType !== name) {
                resetContentForm();
            }

            currentType = name;
            configureManager();
            renderContent();
        }
    }

    document.querySelectorAll(".admin-nav").forEach(button => {
        button.addEventListener("click", function () {
            showSection(this.dataset.section);
        });
    });

    document.querySelectorAll("[data-open]").forEach(button => {
        button.addEventListener("click", function () {
            showSection(this.dataset.open);
        });
    });

    // ==========================================
    // JUMLAH DATA DASHBOARD
    // ==========================================
    function updateCounts() {
        const bannerCountElement = getElement("bannerCount");
        const productCountElement = getElement("productCount");
        const blogCountElement = getElement("blogCount");
        const galleryCountElement = getElement("galleryCount");

        if (bannerCountElement) {
            bannerCountElement.textContent = String(banners.length);
        }

        if (productCountElement) {
            productCountElement.textContent =
                String(getItems("produk").length);
        }

        if (blogCountElement) {
            blogCountElement.textContent =
                String(getItems("blog").length);
        }

        if (galleryCountElement) {
            galleryCountElement.textContent =
                String(getItems("galeri").length);
        }
    }

    // ==========================================
    // PERUBAHAN STORAGE DARI TAB LAIN
    // ==========================================
    window.addEventListener("storage", function (event) {
        if (event.key === "platiniumBanners") {
            banners = loadBanners();
            refreshBannerSelector();
            renderBannerForm(activeBannerIndex);
            updateCounts();
        }

        if (
            event.key &&
            Object.values(contentKeys).includes(event.key)
        ) {
            updateCounts();
            renderContent();
        }
    });

    // ==========================================
    // INISIALISASI
    // ==========================================
    configureManager();
    renderContent();
    updateCounts();
});
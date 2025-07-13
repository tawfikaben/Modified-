// تهيئة التطبيق
class DashboardApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.styles = this.getStyles();
    this.currentUser = null;
    this.orders = [];
    this.currentOrder = null;
    this.currentStatusFilter = 'all';
    this.lastOrdersCount = 0;
    this.lastPendingCount = 0;
    this.dailySalesData = [];
    this.popularItemsData = [];
    this.previousPeriodData = null;
    this.weeklySalesChart = null;
    this.dailySalesChart = null;
    
    this.initFirebase();
    this.loadExternalScripts();
    this.applyStyles();
    this.renderApp();
  }

  // تهيئة Firebase
  initFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyB8t7aItx10OgZhOn4vkuiDzHYchh63cKo",
      authDomain: "fir-afb14.firebaseapp.com",
      databaseURL: "https://fir-afb14-default-rtdb.firebaseio.com",
      projectId: "fir-afb14",
      storageBucket: "fir-afb14.appspot.com",
      messagingSenderId: "696865036390",
      appId: "1:696865036390:web:7299226db4346c5251f5a7",
      measurementId: "G-ENGTMMTDX4"
    };

    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.database = getDatabase(this.app);
    this.auth = getAuth(this.app);
  }

  // تحميل المكتبات الخارجية ديناميكياً
  loadExternalScripts() {
    const scripts = [
      { src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js" },
      { src: "https://cdn.jsdelivr.net/npm/sweetalert2@11" },
      { src: "https://cdn.jsdelivr.net/npm/chart.js" },
      { src: "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0" },
      { 
        src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css",
        type: "stylesheet"
      },
      { 
        src: "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css",
        type: "stylesheet"
      }
    ];

    scripts.forEach(script => {
      if (script.type === "stylesheet") {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = script.src;
        document.head.appendChild(link);
      } else {
        const scriptEl = document.createElement("script");
        scriptEl.src = script.src;
        document.body.appendChild(scriptEl);
      }
    });
  }

  // تطبيق الأنماط
  applyStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = this.styles;
    document.head.appendChild(styleElement);
  }

  // تعريف الأنماط
  getStyles() {
    return `
      :root {
        --primary: #D4AF37;
        --primary-light: #E8C872;
        --secondary: #1A1A2E;
        --light: #F8F5F2;
        --dark: #16213E;
        --gold: #D4AF37;
        --text: #333333;
        --white: #FFFFFF;
        --gray: #EDF2F7;
        --light-gray: #f9f9f9;
        --success: #4CAF50;
        --warning: #FF9800;
        --danger: #F44336;
        --shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        --radius: 16px;
        --radius-sm: 8px;
        --border: 1px solid rgba(0, 0, 0, 0.05);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Tajawal', sans-serif;
        background-color: var(--light);
        color: var(--text);
        line-height: 1.7;
      }

      .container {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1.5rem;
      }

      /* الهيدر المعدل */
      .admin-header {
        background: linear-gradient(135deg, var(--secondary), var(--dark));
        color: var(--white);
        padding: 1.2rem 0;
        box-shadow: var(--shadow);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        border-bottom: 2px solid var(--gold);
      }

      .admin-header .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        font-size: 2rem;
        font-weight: 900;
        display: flex;
        align-items: center;
        color: var(--gold);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .logo i {
        margin-left: 0.8rem;
        font-size: 1.8rem;
      }

      .admin-nav {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .admin-nav a {
        color: var(--white);
        text-decoration: none;
        font-weight: 600;
        transition: var(--transition);
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        position: relative;
        opacity: 0.9;
      }

      .admin-nav a:hover, .admin-nav a.active {
        color: var(--gold);
        opacity: 1;
      }

      .admin-nav a.active::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 2px;
        background: var(--gold);
      }

      .admin-nav a i {
        margin-left: 0.5rem;
        font-size: 1.1rem;
      }

      .logout-btn {
        background: rgba(212, 175, 55, 0.2);
        color: var(--gold);
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: var(--radius);
        cursor: pointer;
        font-family: 'Tajawal', sans-serif;
        font-weight: 600;
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid rgba(212, 175, 55, 0.3);
      }

      .logout-btn:hover {
        background: rgba(212, 175, 55, 0.3);
        transform: translateY(-2px);
      }

      /* المحتوى الرئيسي المعدل */
      .main-content {
        margin-top: 80px;
        padding: 2rem 0;
      }

      .stats-page {
        margin-top: 80px;
        padding: 2rem 0;
        background-color: var(--light);
      }

      .page-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid var(--gray);
      }

      .page-title h1 {
        font-size: 2rem;
        color: var(--secondary);
        font-weight: 800;
        position: relative;
      }

      .page-title h1::after {
        content: "";
        position: absolute;
        bottom: -1.5rem;
        right: 0;
        width: 80px;
        height: 4px;
        background: linear-gradient(to right, var(--gold), var(--primary));
        border-radius: 2px;
      }

      .btn {
        padding: 0.8rem 1.8rem;
        border-radius: var(--radius);
        font-family: 'Tajawal', sans-serif;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
        border: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .btn i {
        font-size: 1rem;
      }

      .btn-primary {
        background: var(--gold);
        color: var(--secondary);
      }

      .btn-primary:hover {
        background: var(--primary-light);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .btn-success {
        background: var(--success);
        color: var(--white);
      }

      .btn-success:hover {
        background: #3d8b40;
        transform: translateY(-2px);
      }

      .btn-secondary {
        background: var(--secondary);
        color: var(--white);
      }

      .btn-secondary:hover {
        background: #0d2b4f;
        transform: translateY(-2px);
      }

      .btn-danger {
        background: var(--danger);
        color: var(--white);
      }

      .btn-danger:hover {
        background: #d32f2f;
        transform: translateY(-2px);
      }

      /* كروت الإحصائيات المعدلة */
      .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        background: var(--white);
        border-radius: var(--radius);
        padding: 2rem;
        box-shadow: var(--shadow);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: var(--border);
        transition: var(--transition);
      }

      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      }

      .stat-info h3 {
        font-size: 1.1rem;
        color: var(--text);
        opacity: 0.8;
        margin-bottom: 0.8rem;
      }

      .stat-info h2 {
        font-size: 2rem;
        color: var(--secondary);
        font-weight: 800;
      }

      .stat-icon {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .stat-icon.primary {
        background: rgba(212, 175, 55, 0.1);
        color: var(--gold);
      }

      .stat-icon.success {
        background: rgba(76, 175, 80, 0.1);
        color: var(--success);
      }

      .stat-icon.warning {
        background: rgba(255, 152, 0, 0.1);
        color: var(--warning);
      }

      .stat-icon.danger {
        background: rgba(244, 67, 54, 0.1);
        color: var(--danger);
      }

      /* صفحة الإحصائيات */
      .date-filter {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        flex-wrap: wrap;
      }

      .filter-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .filter-input {
        padding: 0.7rem 1rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--gray);
        font-family: 'Tajawal', sans-serif;
      }

      .comparison-section {
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: 2rem;
        margin-bottom: 2rem;
        border: var(--border);
      }

      .comparison-section h3 {
        margin-bottom: 1.5rem;
        color: var(--secondary);
        font-size: 1.5rem;
        font-weight: 800;
        border-bottom: 2px solid var(--gray);
        padding-bottom: 1rem;
      }

      .comparison-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .comparison-card {
        background: var(--light-gray);
        border-radius: var(--radius-sm);
        padding: 1.5rem;
        border: var(--border);
      }

      .comparison-card h4 {
        color: var(--secondary);
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }

      .comparison-value {
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--secondary);
      }

      .comparison-change {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        font-weight: 600;
      }

      .positive-change {
        color: var(--success);
      }

      .negative-change {
        color: var(--danger);
      }

      .neutral-change {
        color: var(--text);
        opacity: 0.7;
      }

      .chart-container {
        background: var(--white);
        border-radius: var(--radius);
        padding: 1.5rem;
        margin-bottom: 2rem;
        border: var(--border);
        box-shadow: var(--shadow);
      }

      .chart-container h3 {
        margin-bottom: 1.5rem;
        color: var(--secondary);
        font-size: 1.5rem;
        font-weight: 800;
        border-bottom: 2px solid var(--gray);
        padding-bottom: 1rem;
      }

      .chart-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
        gap: 1rem;
      }

      .sales-table {
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        overflow: hidden;
        margin-bottom: 3rem;
        border: var(--border);
      }

      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.2rem 2rem;
        background: var(--secondary);
        color: var(--white);
      }

      .table-header h3 {
        font-size: 1.3rem;
        font-weight: 700;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        padding: 1.2rem;
        text-align: right;
      }

      th {
        background: var(--light-gray);
        font-weight: 700;
        color: var(--secondary);
        font-size: 0.95rem;
      }

      tr:not(:last-child) {
        border-bottom: 1px solid var(--gray);
      }

      tr:hover {
        background: rgba(0, 0, 0, 0.02);
      }

      .popular-items-section {
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: 2rem;
        margin-bottom: 3rem;
        border: var(--border);
      }

      .popular-items-section h3 {
        margin-bottom: 1.5rem;
        color: var(--secondary);
        font-size: 1.5rem;
        font-weight: 800;
        border-bottom: 2px solid var(--gray);
        padding-bottom: 1rem;
      }

      .popular-items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .popular-item-card {
        background: var(--light-gray);
        border-radius: var(--radius-sm);
        padding: 1.5rem;
        border: var(--border);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .popular-item-name {
        font-weight: 700;
        color: var(--secondary);
        font-size: 1.1rem;
      }

      .popular-item-stats {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
      }

      .popular-item-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .popular-item-stat-value {
        font-weight: 700;
        color: var(--gold);
      }

      .popular-item-stat-label {
        font-size: 0.8rem;
        color: var(--text);
        opacity: 0.7;
      }

      /* فلتر الحالة المعدل */
      .status-filter {
        display: flex;
        gap: 0.8rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }

      .status-btn {
        padding: 0.7rem 1.5rem;
        border-radius: 50px;
        font-size: 0.95rem;
        cursor: pointer;
        border: 1px solid var(--gray);
        background: var(--white);
        transition: var(--transition);
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      }

      .status-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .status-btn.active {
        background: var(--secondary);
        color: var(--white);
        border-color: var(--secondary);
      }

      /* جدول الطلبات المعدل */
      .orders-table {
        width: 100%;
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        overflow: hidden;
        margin-bottom: 3rem;
        border: var(--border);
      }

      .search-box {
        position: relative;
      }

      .search-box input {
        padding: 0.7rem 1.2rem 0.7rem 3rem;
        border-radius: 50px;
        border: none;
        font-family: 'Tajawal', sans-serif;
        width: 300px;
        background: rgba(255,255,255,0.9);
        transition: var(--transition);
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      }

      .search-box input:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
      }

      .search-box i {
        position: absolute;
        right: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text);
        opacity: 0.6;
      }

      .badge {
        display: inline-block;
        padding: 0.4rem 0.8rem;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .badge-success {
        background: rgba(76, 175, 80, 0.1);
        color: var(--success);
      }

      .badge-warning {
        background: rgba(255, 152, 0, 0.1);
        color: var(--warning);
      }

      .badge-danger {
        background: rgba(244, 67, 54, 0.1);
        color: var(--danger);
      }

      .badge-primary {
        background: rgba(212, 175, 55, 0.1);
        color: var(--gold);
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      .action-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
        border: none;
        color: var(--white);
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        font-size: 0.9rem;
      }

      .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }

      .action-btn.edit {
        background: var(--secondary);
      }

      .action-btn.edit:hover {
        background: #0d2b4f;
      }

      .action-btn.delete {
        background: var(--danger);
      }

      .action-btn.delete:hover {
        background: #d32f2f;
      }

      .action-btn.complete {
        background: var(--success);
      }

      .action-btn.complete:hover {
        background: #3d8b40;
      }

      /* مودال تفاصيل الطلب المعدل */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
      }

      .modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .modal {
        background: var(--white);
        border-radius: var(--radius);
        box-shadow: 0 12px 36px rgba(0,0,0,0.2);
        width: 100%;
        max-width: 900px;
        max-height: 90vh;
        overflow-y: auto;
        transform: translateY(30px);
        transition: var(--transition);
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      .modal-overlay.active .modal {
        transform: translateY(0);
      }

      .modal-header {
        padding: 1.8rem;
        border-bottom: 1px solid var(--gray);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--secondary);
        color: var(--white);
      }

      .modal-header h3 {
        font-size: 1.5rem;
        font-weight: 700;
      }

      .close-modal {
        background: none;
        border: none;
        font-size: 1.8rem;
        cursor: pointer;
        color: var(--white);
        opacity: 0.8;
        transition: var(--transition);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-modal:hover {
        opacity: 1;
        background: rgba(255,255,255,0.1);
      }

      .modal-body {
        padding: 2rem;
      }

      .order-details {
        margin-bottom: 2rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .order-details-row {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .order-details-label {
        font-weight: 600;
        color: var(--secondary);
        font-size: 0.95rem;
      }

      /* تحسينات لتغيير الحالة */
      .status-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .status-select {
        padding: 0.7rem 1rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--gray);
        font-family: 'Tajawal', sans-serif;
        background: var(--white);
        color: var(--text);
        flex-grow: 1;
        min-width: 200px;
      }

      .status-select:focus {
        outline: none;
        border-color: var(--gold);
        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
      }

      .order-items {
        margin: 2rem 0;
      }

      .order-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--light-gray);
        border-radius: var(--radius-sm);
        margin-bottom: 0.8rem;
        transition: var(--transition);
        border: var(--border);
      }

      .order-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      }

      .order-total {
        font-weight: 800;
        font-size: 1.5rem;
        text-align: left;
        margin: 2rem 0;
        padding-top: 2rem;
        border-top: 2px solid var(--gray);
        color: var(--secondary);
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid var(--gray);
      }

      /* تأثيرات للطلبات الجديدة */
      .order-row {
        transition: all 0.3s ease;
      }

      @keyframes highlight {
        0% { background-color: rgba(212, 175, 55, 0.2); }
        100% { background-color: transparent; }
      }

      .new-order {
        animation: highlight 3s ease-out;
      }

      /* تأثير تغيير الحالة */
      .status-change-effect {
        animation: statusChange 1.5s ease-out;
      }

      @keyframes statusChange {
        0% { background-color: rgba(212, 175, 55, 0.3); }
        100% { background-color: transparent; }
      }

      /* زر الطباعة المعدل */
      .print-btn {
        background: var(--secondary);
        color: var(--white);
      }

      .print-btn:hover {
        background: #0d2b4f;
      }

      /* تأثيرات SweetAlert2 */
      .animate__animated {
        animation-duration: 0.5s;
      }

      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translate3d(0, -20px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }

      .animate__fadeInDown {
        animation-name: fadeInDown;
      }

      @keyframes fadeOutUp {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
          transform: translate3d(0, -20px, 0);
        }
      }

      .animate__fadeOutUp {
        animation-name: fadeOutUp;
      }

      /* تنسيقات الطباعة */
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content, .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          box-shadow: none;
          transform: none !important;
          padding: 20px;
        }
        .no-print {
          display: none !important;
        }
      }

      /* تأثيرات صوتية للطلبات الجديدة */
      .notification-sound {
        display: none;
      }

      /* تنسيقات للشاشات الكبيرة */
      @media (min-width: 1600px) {
        .container {
          max-width: 1500px;
        }
      }

      /* تنسيقات للجوال */
      @media (max-width: 992px) {
        .stats-cards {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .comparison-cards {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .search-box input {
          width: 200px;
        }
        
        .order-details {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .admin-header .container {
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }

        .admin-nav {
          width: 100%;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .stats-cards {
          grid-template-columns: 1fr;
        }

        .page-title {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .page-title h1::after {
          right: auto;
          left: 0;
        }
        
        .date-filter {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .filter-group {
          width: 100%;
        }
        
        .filter-input {
          width: 100%;
        }
        
        .comparison-cards {
          grid-template-columns: 1fr;
        }
        
        .popular-items-grid {
          grid-template-columns: 1fr;
        }
        
        table {
          display: block;
          overflow-x: auto;
        }
        
        .form-actions {
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .form-actions .btn {
          width: 100%;
          justify-content: center;
        }

        /* تحسينات لتغيير الحالة على الجوال */
        .status-actions {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .status-select {
          width: 100%;
        }
        
        #updateStatusBtn {
          width: 100%;
          justify-content: center;
        }
      }
    `;
  }

  // إنشاء الهيكل الأساسي للتطبيق
  renderApp() {
    // إنشاء الهيدر
    this.createHeader();
    
    // إنشاء المحتوى الرئيسي
    this.createMainContent();
    
    // إنشاء صفحة الإحصائيات (مخفية في البداية)
    this.createStatsPage();
    
    // إنشاء مودال تفاصيل الطلب
    this.createOrderModal();
    
    // إنشاء تأثير صوتي للطلبات الجديدة
    this.createNotificationSound();
    
    // تهيئة المصادقة
    this.initAuth();
  }

  // إنشاء الهيدر
  createHeader() {
    const header = document.createElement('header');
    header.className = 'admin-header';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    // إنشاء اللوجو
    const logo = document.createElement('div');
    logo.className = 'logo';
    
    const logoIcon = document.createElement('i');
    logoIcon.className = 'fas fa-utensils';
    
    const logoText = document.createElement('span');
    logoText.textContent = 'Demo | لوحة التحكم';
    
    logo.appendChild(logoIcon);
    logo.appendChild(logoText);
    
    // إنشاء قائمة التنقل
    const nav = document.createElement('nav');
    nav.className = 'admin-nav';
    
    // روابط التنقل
    const statsLink = this.createNavLink('statsLink', 'fas fa-chart-line', 'الإحصائيات');
    const ordersLink = this.createNavLink('ordersLink', 'fas fa-shopping-cart', 'الطلبات', true);
    const menuLink = this.createNavLink('menuLink', 'fas fa-list', 'قائمة الطعام', false, 'menu.html');
    
    // زر تسجيل الخروج
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'logout-btn';
    
    const logoutIcon = document.createElement('i');
    logoutIcon.className = 'fas fa-sign-out-alt';
    
    const logoutText = document.createElement('span');
    logoutText.textContent = 'تسجيل الخروج';
    
    logoutBtn.appendChild(logoutIcon);
    logoutBtn.appendChild(logoutText);
    
    // تجميع عناصر التنقل
    nav.appendChild(statsLink);
    nav.appendChild(ordersLink);
    nav.appendChild(menuLink);
    nav.appendChild(logoutBtn);
    
    // تجميع الهيدر
    container.appendChild(logo);
    container.appendChild(nav);
    header.appendChild(container);
    
    // إضافة الهيدر إلى الصفحة
    this.appContainer.appendChild(header);
    
    // إضافة أحداث النقر
    statsLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePages(true);
    });
    
    ordersLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePages(false);
    });
    
    logoutBtn.addEventListener('click', () => this.logout());
  }

  // إنشاء رابط تنقل
  createNavLink(id, iconClass, text, isActive = false, href = '#') {
    const link = document.createElement('a');
    link.id = id;
    link.href = href;
    
    const icon = document.createElement('i');
    icon.className = iconClass;
    
    const span = document.createElement('span');
    span.textContent = text;
    
    link.appendChild(icon);
    link.appendChild(span);
    
    if (isActive) {
      link.classList.add('active');
    }
    
    return link;
  }

  // إنشاء المحتوى الرئيسي
  createMainContent() {
    const mainContent = document.createElement('main');
    mainContent.className = 'main-content';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    // إنشاء عنوان الصفحة
    const pageTitle = this.createPageTitle('إدارة الطلبات', [
      { id: 'resetAllBtn', text: 'إعادة التشغيل', icon: 'fas fa-trash', className: 'btn-danger' },
      { id: 'printAllBtn', text: 'طباعة السجل', icon: 'fas fa-print', className: 'btn-primary' },
      { id: 'openModificationBtn', text: 'تعديل على القائمة', icon: 'fas fa-edit', className: 'btn-secondary' }
    ]);
    
    // إنشاء كروت الإحصائيات
    const statsCards = this.createStatsCards();
    
    // إنشاء فلتر الحالة
    const statusFilter = this.createStatusFilter();
    
    // إنشاء جدول الطلبات
    const ordersTable = this.createOrdersTable();
    
    // تجميع المحتوى
    container.appendChild(pageTitle);
    container.appendChild(statsCards);
    container.appendChild(statusFilter);
    container.appendChild(ordersTable);
    
    mainContent.appendChild(container);
    this.appContainer.appendChild(mainContent);
    
    // إضافة أحداث النقر للأزرار
    document.getElementById('resetAllBtn').addEventListener('click', () => this.resetAllOrders());
    document.getElementById('printAllBtn').addEventListener('click', () => this.printAllOrders());
    document.getElementById('openModificationBtn').addEventListener('click', () => this.openModificationFile());
    
    // تحميل الطلبات
    this.loadOrders();
  }

  // إنشاء عنوان الصفحة مع الأزرار
  createPageTitle(title, buttons) {
    const pageTitle = document.createElement('div');
    pageTitle.className = 'page-title';
    
    const titleElement = document.createElement('h1');
    titleElement.textContent = title;
    
    const buttonsContainer = document.createElement('div');
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.id = btn.id;
      button.className = `btn ${btn.className}`;
      
      const icon = document.createElement('i');
      icon.className = btn.icon;
      
      const span = document.createElement('span');
      span.textContent = btn.text;
      
      button.appendChild(icon);
      button.appendChild(span);
      
      buttonsContainer.appendChild(button);
    });
    
    pageTitle.appendChild(titleElement);
    pageTitle.appendChild(buttonsContainer);
    
    return pageTitle;
  }

  // إنشاء كروت الإحصائيات
  createStatsCards() {
    const statsCards = document.createElement('div');
    statsCards.className = 'stats-cards';
    
    const cards = [
      { id: 'totalOrders', title: 'إجمالي الطلبات', value: '0', icon: 'fas fa-shopping-cart', className: 'primary' },
      { id: 'pendingOrders', title: 'طلبات جديدة', value: '0', icon: 'fas fa-clock', className: 'warning' },
      { id: 'completedOrders', title: 'طلبات مكتملة', value: '0', icon: 'fas fa-check-circle', className: 'success' },
      { id: 'totalSales', title: 'إجمالي المبيعات', value: '0 درهم', icon: 'fas fa-money-bill-wave', className: 'danger' }
    ];
    
    cards.forEach(card => {
      const statCard = document.createElement('div');
      statCard.className = 'stat-card';
      
      const statInfo = document.createElement('div');
      statInfo.className = 'stat-info';
      
      const title = document.createElement('h3');
      title.textContent = card.title;
      
      const value = document.createElement('h2');
      value.id = card.id;
      value.textContent = card.value;
      
      statInfo.appendChild(title);
      statInfo.appendChild(value);
      
      const statIcon = document.createElement('div');
      statIcon.className = `stat-icon ${card.className}`;
      
      const icon = document.createElement('i');
      icon.className = card.icon;
      
      statIcon.appendChild(icon);
      
      statCard.appendChild(statInfo);
      statCard.appendChild(statIcon);
      
      statsCards.appendChild(statCard);
    });
    
    return statsCards;
  }

  // إنشاء فلتر الحالة
  createStatusFilter() {
    const statusFilter = document.createElement('div');
    statusFilter.className = 'status-filter';
    
    const statuses = [
      { status: 'all', text: 'الكل', active: true },
      { status: 'pending', text: 'جديدة' },
      { status: 'preparing', text: 'قيد التحضير' },
      { status: 'completed', text: 'مكتملة' },
      { status: 'cancelled', text: 'ملغاة' }
    ];
    
    statuses.forEach(status => {
      const button = document.createElement('button');
      button.className = `status-btn ${status.active ? 'active' : ''}`;
      button.dataset.status = status.status;
      button.textContent = status.text;
      
      button.addEventListener('click', () => {
        document.querySelectorAll('.status-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.filterOrdersByStatus(status.status);
      });
      
      statusFilter.appendChild(button);
    });
    
    return statusFilter;
  }

  // إنشاء جدول الطلبات
  createOrdersTable() {
    const ordersTableContainer = document.createElement('div');
    ordersTableContainer.className = 'orders-table';
    
    // رأس الجدول
    const tableHeader = document.createElement('div');
    tableHeader.className = 'table-header';
    
    const headerTitle = document.createElement('h3');
    const headerIcon = document.createElement('i');
    headerIcon.className = 'fas fa-list';
    
    headerTitle.appendChild(headerIcon);
    headerTitle.appendChild(document.createTextNode(' سجل الطلبات'));
    
    // مربع البحث
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchOrders';
    searchInput.placeholder = 'ابحث برقم الطلب أو الطاولة...';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    
    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchIcon);
    
    tableHeader.appendChild(headerTitle);
    tableHeader.appendChild(searchBox);
    
    // الجدول
    const table = document.createElement('table');
    
    // رأس الجدول
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['رقم الطلب', 'رقم الطاولة', 'الوقت', 'المجموع', 'الحالة', 'الإجراءات'];
    
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    
    // جسم الجدول
    const tbody = document.createElement('tbody');
    tbody.id = 'ordersTable';
    
    // رسالة التحميل
    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');
    loadingCell.colSpan = 6;
    loadingCell.style.textAlign = 'center';
    loadingCell.style.padding = '2rem';
    loadingCell.style.color = 'var(--text)';
    loadingCell.style.opacity = '0.6';
    
    const loadingIcon = document.createElement('i');
    loadingIcon.className = 'fas fa-spinner fa-spin';
    loadingIcon.style.fontSize = '1.5rem';
    loadingIcon.style.marginBottom = '1rem';
    
    const loadingText = document.createElement('p');
    loadingText.textContent = 'جاري تحميل الطلبات...';
    
    loadingCell.appendChild(loadingIcon);
    loadingCell.appendChild(loadingText);
    loadingRow.appendChild(loadingCell);
    tbody.appendChild(loadingRow);
    
    table.appendChild(thead);
    table.appendChild(tbody);
    
    ordersTableContainer.appendChild(tableHeader);
    ordersTableContainer.appendChild(table);
    
    // إضافة حدث البحث
    searchInput.addEventListener('input', () => {
      this.searchOrders(searchInput.value.trim());
    });
    
    return ordersTableContainer;
  }

  // إنشاء صفحة الإحصائيات
  createStatsPage() {
    const statsPage = document.createElement('div');
    statsPage.id = 'statsPage';
    statsPage.className = 'stats-page';
    statsPage.style.display = 'none';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    // عنوان الصفحة
    const pageTitle = this.createPageTitle('إحصائيات المبيعات', [
      { id: 'printStatsBtn', text: 'طباعة التقرير', icon: 'fas fa-print', className: 'btn-primary' }
    ]);
    
    // كروت الإحصائيات
    const statsCards = document.createElement('div');
    statsCards.className = 'stats-cards';
    
    const statsCardsData = [
      { id: 'totalSalesStats', title: 'إجمالي المبيعات', value: '0 درهم', icon: 'fas fa-money-bill-wave', className: 'primary' },
      { id: 'avgDailySales', title: 'متوسط المبيعات اليومية', value: '0 درهم', icon: 'fas fa-calculator', className: 'success' },
      { id: 'bestDaySales', title: 'أفضل يوم مبيعات', value: '0 درهم', icon: 'fas fa-trophy', className: 'danger' }
    ];
    
    statsCardsData.forEach(card => {
      const statCard = document.createElement('div');
      statCard.className = 'stat-card';
      
      const statInfo = document.createElement('div');
      statInfo.className = 'stat-info';
      
      const title = document.createElement('h3');
      title.textContent = card.title;
      
      const value = document.createElement('h2');
      value.id = card.id;
      value.textContent = card.value;
      
      statInfo.appendChild(title);
      statInfo.appendChild(value);
      
      const statIcon = document.createElement('div');
      statIcon.className = `stat-icon ${card.className}`;
      
      const icon = document.createElement('i');
      icon.className = card.icon;
      
      statIcon.appendChild(icon);
      
      statCard.appendChild(statInfo);
      statCard.appendChild(statIcon);
      
      statsCards.appendChild(statCard);
    });
    
    // فلتر التاريخ
    const dateFilter = document.createElement('div');
    dateFilter.className = 'date-filter';
    
    // مجموعة من التاريخ
    const startDateGroup = document.createElement('div');
    startDateGroup.className = 'filter-group';
    
    const startDateLabel = document.createElement('label');
    startDateLabel.htmlFor = 'startDate';
    startDateLabel.textContent = 'من:';
    
    const startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.id = 'startDate';
    startDateInput.className = 'filter-input';
    
    startDateGroup.appendChild(startDateLabel);
    startDateGroup.appendChild(startDateInput);
    
    // مجموعة إلى التاريخ
    const endDateGroup = document.createElement('div');
    endDateGroup.className = 'filter-group';
    
    const endDateLabel = document.createElement('label');
    endDateLabel.htmlFor = 'endDate';
    endDateLabel.textContent = 'إلى:';
    
    const endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.id = 'endDate';
    endDateInput.className = 'filter-input';
    
    endDateGroup.appendChild(endDateLabel);
    endDateGroup.appendChild(endDateInput);
    
    // أزرار الفلتر
    const applyFilterBtn = document.createElement('button');
    applyFilterBtn.id = 'applyFilter';
    applyFilterBtn.className = 'btn btn-secondary';
    
    const applyFilterIcon = document.createElement('i');
    applyFilterIcon.className = 'fas fa-filter';
    
    const applyFilterText = document.createElement('span');
    applyFilterText.textContent = 'تطبيق الفلتر';
    
    applyFilterBtn.appendChild(applyFilterIcon);
    applyFilterBtn.appendChild(applyFilterText);
    
    const resetFilterBtn = document.createElement('button');
    resetFilterBtn.id = 'resetFilter';
    resetFilterBtn.className = 'btn';
    
    const resetFilterIcon = document.createElement('i');
    resetFilterIcon.className = 'fas fa-redo';
    
    const resetFilterText = document.createElement('span');
    resetFilterText.textContent = 'إعادة التعيين';
    
    resetFilterBtn.appendChild(resetFilterIcon);
    resetFilterBtn.appendChild(resetFilterText);
    
    dateFilter.appendChild(startDateGroup);
    dateFilter.appendChild(endDateGroup);
    dateFilter.appendChild(applyFilterBtn);
    dateFilter.appendChild(resetFilterBtn);
    
    // مخطط الأسبوع
    const weeklyChartContainer = document.createElement('div');
    weeklyChartContainer.className = 'chart-container';
    
    const weeklyChartTitle = document.createElement('h3');
    const weeklyChartIcon = document.createElement('i');
    weeklyChartIcon.className = 'fas fa-chart-line';
    
    weeklyChartTitle.appendChild(weeklyChartIcon);
    weeklyChartTitle.appendChild(document.createTextNode(' المبيعات خلال 7 أيام'));
    
    const weeklyChartCanvas = document.createElement('canvas');
    weeklyChartCanvas.id = 'weeklySalesChart';
    
    const chartActions = document.createElement('div');
    chartActions.className = 'chart-actions';
    
    const printWeeklyChartBtn = document.createElement('button');
    printWeeklyChartBtn.id = 'printWeeklyChartBtn';
    printWeeklyChartBtn.className = 'btn btn-secondary';
    
    const printWeeklyChartIcon = document.createElement('i');
    printWeeklyChartIcon.className = 'fas fa-print';
    
    const printWeeklyChartText = document.createElement('span');
    printWeeklyChartText.textContent = 'طباعة التقرير الأسبوعي';
    
    printWeeklyChartBtn.appendChild(printWeeklyChartIcon);
    printWeeklyChartBtn.appendChild(printWeeklyChartText);
    
    chartActions.appendChild(printWeeklyChartBtn);
    
    weeklyChartContainer.appendChild(weeklyChartTitle);
    weeklyChartContainer.appendChild(weeklyChartCanvas);
    weeklyChartContainer.appendChild(chartActions);
    
    // قسم مقارنة الأداء
    const comparisonSection = document.createElement('div');
    comparisonSection.className = 'comparison-section';
    
    const comparisonTitle = document.createElement('h3');
    const comparisonIcon = document.createElement('i');
    comparisonIcon.className = 'fas fa-chart-bar';
    
    comparisonTitle.appendChild(comparisonIcon);
    comparisonTitle.appendChild(document.createTextNode(' مقارنة الأداء'));
    
    const comparisonCards = document.createElement('div');
    comparisonCards.className = 'comparison-cards';
    
    const comparisonData = [
      { id: 'salesComparison', title: 'مقارنة المبيعات', value: '0%', trendId: 'salesTrend' },
      { id: 'ordersComparison', title: 'مقارنة عدد الطلبات', value: '0%', trendId: 'ordersTrend' },
      { id: 'avgOrderComparison', title: 'مقارنة متوسط قيمة الطلب', value: '0%', trendId: 'avgOrderTrend' }
    ];
    
    comparisonData.forEach(item => {
      const comparisonCard = document.createElement('div');
      comparisonCard.className = 'comparison-card';
      
      const cardTitle = document.createElement('h4');
      cardTitle.textContent = item.title;
      
      const comparisonValue = document.createElement('div');
      comparisonValue.className = 'comparison-value';
      comparisonValue.id = item.id;
      comparisonValue.textContent = item.value;
      
      const comparisonChange = document.createElement('div');
      comparisonChange.className = 'comparison-change';
      comparisonChange.id = item.trendId;
      
      const neutralIcon = document.createElement('i');
      neutralIcon.className = 'fas fa-equals neutral-change';
      
      const neutralText = document.createElement('span');
      neutralText.className = 'neutral-change';
      neutralText.textContent = 'لا يوجد تغيير';
      
      comparisonChange.appendChild(neutralIcon);
      comparisonChange.appendChild(neutralText);
      
      comparisonCard.appendChild(cardTitle);
      comparisonCard.appendChild(comparisonValue);
      comparisonCard.appendChild(comparisonChange);
      
      comparisonCards.appendChild(comparisonCard);
    });
    
    comparisonSection.appendChild(comparisonTitle);
    comparisonSection.appendChild(comparisonCards);
    
    // المخطط اليومي
    const dailyChartContainer = document.createElement('div');
    dailyChartContainer.className = 'chart-container';
    
    const dailyChartTitle = document.createElement('h3');
    const dailyChartIcon = document.createElement('i');
    dailyChartIcon.className = 'fas fa-calendar-day';
    
    dailyChartTitle.appendChild(dailyChartIcon);
    dailyChartTitle.appendChild(document.createTextNode(' المبيعات اليومية'));
    
    const dailyChartCanvas = document.createElement('canvas');
    dailyChartCanvas.id = 'dailySalesChart';
    
    dailyChartContainer.appendChild(dailyChartTitle);
    dailyChartContainer.appendChild(dailyChartCanvas);
    
    // جدول المبيعات اليومية
    const salesTable = document.createElement('div');
    salesTable.className = 'sales-table';
    
    const salesTableHeader = document.createElement('div');
    salesTableHeader.className = 'table-header';
    
    const salesTableTitle = document.createElement('h3');
    const salesTableIcon = document.createElement('i');
    salesTableIcon.className = 'fas fa-table';
    
    salesTableTitle.appendChild(salesTableIcon);
    salesTableTitle.appendChild(document.createTextNode(' تفاصيل المبيعات اليومية'));
    
    salesTableHeader.appendChild(salesTableTitle);
    
    const salesTableElement = document.createElement('table');
    
    const salesTableHead = document.createElement('thead');
    const salesTableHeaderRow = document.createElement('tr');
    
    const salesTableHeaders = ['التاريخ', 'عدد الطلبات', 'إجمالي المبيعات', 'متوسط قيمة الطلب'];
    
    salesTableHeaders.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      salesTableHeaderRow.appendChild(th);
    });
    
    salesTableHead.appendChild(salesTableHeaderRow);
    
    const salesTableBody = document.createElement('tbody');
    salesTableBody.id = 'dailySalesTable';
    
    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');
    loadingCell.colSpan = 4;
    loadingCell.style.textAlign = 'center';
    loadingCell.style.padding = '2rem';
    loadingCell.style.color = 'var(--text)';
    loadingCell.style.opacity = '0.6';
    
    const loadingIcon = document.createElement('i');
    loadingIcon.className = 'fas fa-spinner fa-spin';
    loadingIcon.style.fontSize = '1.5rem';
    loadingIcon.style.marginBottom = '1rem';
    
    const loadingText = document.createElement('p');
    loadingText.textContent = 'جاري تحميل البيانات...';
    
    loadingCell.appendChild(loadingIcon);
    loadingCell.appendChild(loadingText);
    loadingRow.appendChild(loadingCell);
    salesTableBody.appendChild(loadingRow);
    
    salesTableElement.appendChild(salesTableHead);
    salesTableElement.appendChild(salesTableBody);
    
    salesTable.appendChild(salesTableHeader);
    salesTable.appendChild(salesTableElement);
    
    // الأطباق الأكثر مبيعا
    const popularItemsSection = document.createElement('div');
    popularItemsSection.className = 'popular-items-section';
    
    const popularItemsTitle = document.createElement('h3');
    const popularItemsIcon = document.createElement('i');
    popularItemsIcon.className = 'fas fa-utensils';
    
    popularItemsTitle.appendChild(popularItemsIcon);
    popularItemsTitle.appendChild(document.createTextNode(' الأطباق الأكثر طلباً'));
    
    const popularItemsGrid = document.createElement('div');
    popularItemsGrid.id = 'popularItemsGrid';
    popularItemsGrid.className = 'popular-items-grid';
    
    popularItemsSection.appendChild(popularItemsTitle);
    popularItemsSection.appendChild(popularItemsGrid);
    
    // تجميع كل العناصر
    container.appendChild(pageTitle);
    container.appendChild(statsCards);
    container.appendChild(dateFilter);
    container.appendChild(weeklyChartContainer);
    container.appendChild(comparisonSection);
    container.appendChild(dailyChartContainer);
    container.appendChild(salesTable);
    container.appendChild(popularItemsSection);
    
    statsPage.appendChild(container);
    this.appContainer.appendChild(statsPage);
    
    // إضافة أحداث النقر
    applyFilterBtn.addEventListener('click', () => this.calculateStatistics());
    resetFilterBtn.addEventListener('click', () => this.resetDateFilter());
    printStatsBtn.addEventListener('click', () => this.printStatisticsReport());
    printWeeklyChartBtn.addEventListener('click', () => this.printWeeklyReport());
  }

  // إنشاء مودال تفاصيل الطلب
  createOrderModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'orderModal';
    modalOverlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // رأس المودال
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h3');
    modalTitle.id = 'modalTitle';
    modalTitle.textContent = 'تفاصيل الطلب #';
    
    const orderIdSpan = document.createElement('span');
    orderIdSpan.id = 'orderId';
    
    modalTitle.appendChild(orderIdSpan);
    
    const closeModalBtn = document.createElement('button');
    closeModalBtn.id = 'closeModal';
    closeModalBtn.className = 'close-modal';
    closeModalBtn.innerHTML = '&times;';
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeModalBtn);
    
    // جسم المودال
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // تفاصيل الطلب
    const orderDetails = document.createElement('div');
    orderDetails.className = 'order-details';
    
    // رقم الطاولة
    const tableRow = this.createOrderDetailRow('رقم الطاولة:', 'orderTable', '-');
    
    // حالة الطلب
    const statusRow = document.createElement('div');
    statusRow.className = 'order-details-row';
    
    const statusLabel = document.createElement('div');
    statusLabel.className = 'order-details-label';
    statusLabel.textContent = 'حالة الطلب:';
    
    const statusValue = document.createElement('div');
    statusValue.id = 'orderStatus';
    
    const statusBadge = document.createElement('span');
    statusBadge.className = 'badge badge-warning';
    statusBadge.textContent = 'جديد';
    
    statusValue.appendChild(statusBadge);
    statusRow.appendChild(statusLabel);
    statusRow.appendChild(statusValue);
    
    // وقت الطلب
    const timeRow = this.createOrderDetailRow('وقت الطلب:', 'orderTime', '-');
    
    // ملاحظات
    const notesRow = this.createOrderDetailRow('ملاحظات:', 'orderNotes', 'لا توجد ملاحظات');
    
    // تغيير الحالة
    const changeStatusRow = document.createElement('div');
    changeStatusRow.className = 'order-details-row';
    
    const changeStatusLabel = document.createElement('div');
    changeStatusLabel.className = 'order-details-label';
    changeStatusLabel.textContent = 'تغيير الحالة:';
    
    const statusActions = document.createElement('div');
    statusActions.className = 'status-actions';
    
    const statusSelect = document.createElement('select');
    statusSelect.id = 'statusSelect';
    statusSelect.className = 'status-select';
    
    const statusOptions = [
      { value: 'pending', text: 'جديد' },
      { value: 'preparing', text: 'قيد التحضير' },
      { value: 'completed', text: 'مكتمل' },
      { value: 'cancelled', text: 'ملغى' }
    ];
    
    statusOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      statusSelect.appendChild(optionElement);
    });
    
    const updateStatusBtn = document.createElement('button');
    updateStatusBtn.id = 'updateStatusBtn';
    updateStatusBtn.className = 'btn btn-primary';
    
    const updateStatusIcon = document.createElement('i');
    updateStatusIcon.className = 'fas fa-save';
    
    const updateStatusText = document.createElement('span');
    updateStatusText.textContent = ' تحديث';
    
    updateStatusBtn.appendChild(updateStatusIcon);
    updateStatusBtn.appendChild(updateStatusText);
    
    statusActions.appendChild(statusSelect);
    statusActions.appendChild(updateStatusBtn);
    
    changeStatusRow.appendChild(changeStatusLabel);
    changeStatusRow.appendChild(statusActions);
    
    // تجميع تفاصيل الطلب
    orderDetails.appendChild(tableRow);
    orderDetails.appendChild(statusRow);
    orderDetails.appendChild(timeRow);
    orderDetails.appendChild(notesRow);
    orderDetails.appendChild(changeStatusRow);
    
    // الأصناف المطلوبة
    const itemsTitle = document.createElement('h4');
    const itemsIcon = document.createElement('i');
    itemsIcon.className = 'fas fa-utensils';
    
    itemsTitle.appendChild(itemsIcon);
    itemsTitle.appendChild(document.createTextNode(' الأصناف المطلوبة:'));
    
    const orderItemsList = document.createElement('div');
    orderItemsList.id = 'orderItemsList';
    orderItemsList.className = 'order-items';
    
    // المجموع
    const orderTotal = document.createElement('div');
    orderTotal.className = 'order-total';
    orderTotal.textContent = 'المجموع: ';
    
    const totalSpan = document.createElement('span');
    totalSpan.id = 'orderTotal';
    totalSpan.textContent = '0';
    
    orderTotal.appendChild(totalSpan);
    orderTotal.appendChild(document.createTextNode(' درهم'));
    
    // أزرار الإجراءات
    const formActions = document.createElement('div');
    formActions.className = 'form-actions';
    
    const printOrderBtn = document.createElement('button');
    printOrderBtn.type = 'button';
    printOrderBtn.className = 'btn print-btn';
    printOrderBtn.id = 'printOrderBtn';
    
    const printOrderIcon = document.createElement('i');
    printOrderIcon.className = 'fas fa-print';
    
    const printOrderText = document.createElement('span');
    printOrderText.textContent = ' طباعة';
    
    printOrderBtn.appendChild(printOrderIcon);
    printOrderBtn.appendChild(printOrderText);
    
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn';
    cancelBtn.id = 'cancelBtn';
    cancelBtn.textContent = 'إغلاق';
    
    formActions.appendChild(printOrderBtn);
    formActions.appendChild(cancelBtn);
    
    // تجميع جسم المودال
    modalBody.appendChild(orderDetails);
    modalBody.appendChild(itemsTitle);
    modalBody.appendChild(orderItemsList);
    modalBody.appendChild(orderTotal);
    modalBody.appendChild(formActions);
    
    // تجميع المودال
    modal.appendChild(modalHeader);
    modal.appendChild(modalBody);
    modalOverlay.appendChild(modal);
    
    // إضافة المودال إلى الصفحة
    this.appContainer.appendChild(modalOverlay);
    
    // إضافة أحداث النقر
    closeModalBtn.addEventListener('click', () => this.closeOrderModal());
    cancelBtn.addEventListener('click', () => this.closeOrderModal());
    printOrderBtn.addEventListener('click', () => this.printOrder());
    updateStatusBtn.addEventListener('click', () => this.updateOrderStatusFromModal());
  }

  // إنشاء صف تفاصيل الطلب
  createOrderDetailRow(label, id, defaultValue) {
    const row = document.createElement('div');
    row.className = 'order-details-row';
    
    const labelElement = document.createElement('div');
    labelElement.className = 'order-details-label';
    labelElement.textContent = label;
    
    const valueElement = document.createElement('div');
    valueElement.id = id;
    valueElement.textContent = defaultValue;
    
    row.appendChild(labelElement);
    row.appendChild(valueElement);
    
    return row;
  }

  // إنشاء تأثير صوتي للطلبات الجديدة
  createNotificationSound() {
    const audio = document.createElement('audio');
    audio.className = 'notification-sound';
    audio.id = 'notificationSound';
    audio.preload = 'auto';
    
    const source = document.createElement('source');
    source.src = 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3';
    source.type = 'audio/mpeg';
    
    audio.appendChild(source);
    this.appContainer.appendChild(audio);
  }

  // تهيئة المصادقة
  initAuth() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.loadOrders();
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  // تسجيل الخروج
  logout() {
    Swal.fire({
      title: 'تسجيل الخروج',
      text: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، سجل خروج',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(this.auth).then(() => {
          window.location.href = 'login.html';
        }).catch((error) => {
          Swal.fire(
            'خطأ!',
            'حدث خطأ أثناء تسجيل الخروج: ' + error.message,
            'error'
          );
        });
      }
    });
  }

  // تحميل الطلبات
  loadOrders() {
    const ordersTable = document.getElementById('ordersTable');
    ordersTable.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text); opacity: 0.6;">
          <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; margin-bottom: 1rem;"></i>
          <p>جاري تحميل الطلبات...</p>
        </td>
      </tr>
    `;
    
    const ordersRef = ref(this.database, 'orders');
    
    // استماع للإضافات الجديدة
    onChildAdded(ordersRef, (snapshot) => {
      const newOrder = snapshot.val();
      newOrder.id = snapshot.key;
      
      this.orders.unshift(newOrder);
      this.updateStats();
      
      this.displayOrders(this.orders.filter(order => 
        this.currentStatusFilter === 'all' || order.status === this.currentStatusFilter
      ));
      
      this.showNewOrderNotification(newOrder);
    });
    
    // استماع للتغييرات الأخرى
    onValue(ordersRef, (snapshot) => {
      this.orders = [];
      snapshot.forEach(childSnapshot => {
        const order = childSnapshot.val();
        order.id = childSnapshot.key;
        this.orders.push(order);
      });
      
      this.updateStats();
    });
  }

  // عرض الطلبات في الجدول
  displayOrders(ordersList) {
    const ordersTable = document.getElementById('ordersTable');
    
    ordersList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (ordersList.length === 0) {
      ordersTable.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text); opacity: 0.6;">
            <i class="fas fa-info-circle" style="font-size: 1.5rem; margin-bottom: 1rem;"></i>
            <p>لا توجد طلبات</p>
          </td>
        </tr>
      `;
      return;
    }
    
    ordersTable.innerHTML = ordersList.map(order => {
      let statusText = '';
      let badgeClass = '';
      
      switch (order.status) {
        case 'pending':
          statusText = 'جديد';
          badgeClass = 'badge-warning';
          break;
        case 'preparing':
          statusText = 'قيد التحضير';
          badgeClass = 'badge-primary';
          break;
        case 'completed':
          statusText = 'مكتمل';
          badgeClass = 'badge-success';
          break;
        case 'cancelled':
          statusText = 'ملغى';
          badgeClass = 'badge-danger';
          break;
        default:
          statusText = order.status || 'غير معروف';
          badgeClass = 'badge-secondary';
      }
      
      return `
        <tr class="order-row" data-id="${order.id}">
          <td>${order.id || '-'}</td>
          <td>${order.table || '-'}</td>
          <td>${this.formatDateTime(order.timestamp)}</td>
          <td>${order.total || '0'} درهم</td>
          <td><span class="badge ${badgeClass}">${statusText}</span></td>
          <td>
            <div class="actions">
              <button class="action-btn edit" data-id="${order.id}">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn complete" data-id="${order.id}" ${order.status === 'completed' ? 'style="display: none;"' : ''}>
                <i class="fas fa-check"></i>
              </button>
              <button class="action-btn delete" data-id="${order.id}" ${order.status === 'cancelled' ? 'style="display: none;"' : ''}>
                <i class="fas fa-times"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
    
    // إضافة تأثير للصف الجديد
    document.querySelectorAll('.order-row:not(.loaded)').forEach(row => {
      row.classList.add('new-order', 'loaded');
    });
    
    // إضافة أحداث النقر للأزرار
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        const order = this.orders.find(o => o.id === orderId);
        if (order) this.openOrderModal(order);
      });
    });
    
    document.querySelectorAll('.action-btn.complete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.getAttribute('data-id');
        this.updateOrderStatus(orderId, 'completed');
      });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.getAttribute('data-id');
        this.updateOrderStatus(orderId, 'cancelled');
      });
    });
  }

  // تحديث حالة الطلب من المودال
  updateOrderStatusFromModal() {
    if (!this.currentOrder) return;
    
    const newStatus = document.getElementById('statusSelect').value;
    if (newStatus !== this.currentOrder.status) {
      this.updateOrderStatus(this.currentOrder.id, newStatus);
    } else {
      toastr.info('حالة الطلب لم تتغير');
    }
  }

  // تحديث حالة الطلب
  updateOrderStatus(orderId, newStatus) {
    const messages = {
      'pending': {
        title: 'تغيير الحالة إلى "جديد"',
        text: 'هل تريد إعادة الطلب إلى الحالة الجديدة؟',
        icon: 'question'
      },
      'preparing': {
        title: 'تغيير الحالة إلى "قيد التحضير"',
        text: 'سيتم إعلام المطبخ ببدء التحضير',
        icon: 'info'
      },
      'completed': {
        title: 'إكمال الطلب',
        text: 'هل تريد تأكيد إتمام هذا الطلب؟',
        icon: 'success'
      },
      'cancelled': {
        title: 'إلغاء الطلب',
        text: 'هل أنت متأكد من إلغاء هذا الطلب؟',
        icon: 'warning'
      }
    };

    const { title, text, icon } = messages[newStatus] || {
      title: 'تغيير الحالة',
      text: 'هل تريد تغيير حالة هذا الطلب؟',
      icon: 'question'
    };

    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#d33',
      confirmButtonText: 'تأكيد',
      cancelButtonText: 'إلغاء',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const orderRef = ref(this.database, `orders/${orderId}/status`);
        
        set(orderRef, newStatus)
          .then(() => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'تم التحديث بنجاح!',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              }
            });

            if (this.currentOrder && this.currentOrder.id === orderId) {
              this.currentOrder.status = newStatus;
              this.updateOrderStatusDisplay(newStatus);
            }

            this.displayOrders(this.orders.filter(order => 
              this.currentStatusFilter === 'all' || order.status === this.currentStatusFilter
            ));

            const updatedRow = document.querySelector(`.order-row[data-id="${orderId}"]`);
            if (updatedRow) {
              updatedRow.classList.add('status-change-effect');
              setTimeout(() => {
                updatedRow.classList.remove('status-change-effect');
              }, 1500);
            }

            this.updateStats();
          })
          .catch((error) => {
            Swal.fire(
              'خطأ!',
              'حدث خطأ أثناء التحديث: ' + error.message,
              'error'
            );
          });
      }
    });
  }

  // تصفية الطلبات حسب الحالة
  filterOrdersByStatus(status) {
    this.currentStatusFilter = status;
    
    if (status === 'all') {
      this.displayOrders(this.orders);
      return;
    }
    
    const filteredOrders = this.orders.filter(order => order.status === status);
    this.displayOrders(filteredOrders);
  }

  // البحث في الطلبات
  searchOrders(query) {
    if (!query) {
      this.filterOrdersByStatus(this.currentStatusFilter);
      return;
    }
    
    const filteredOrders = this.orders.filter(order => 
      (order.id && order.id.includes(query)) ||
      (order.table && order.table.toString().includes(query)) ||
      (order.notes && order.notes.includes(query))
    );
    
    this.displayOrders(filteredOrders);
  }

  // فتح مودال الطلب
  openOrderModal(order) {
    this.currentOrder = order;
    
    document.getElementById('orderId').textContent = order.id || '-';
    document.getElementById('orderTable').textContent = order.table || '-';
    document.getElementById('orderTime').textContent = this.formatDateTime(order.timestamp);
    document.getElementById('orderNotes').textContent = order.notes || 'لا توجد ملاحظات';
    document.getElementById('orderTotal').textContent = order.total || '0';
    
    this.updateOrderStatusDisplay(order.status);
    
    const orderItemsList = document.getElementById('orderItemsList');
    orderItemsList.innerHTML = '';
    
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
          <div>${item.plat} × ${item.quantity}</div>
          <div style="font-weight: 700;">${item.prix * item.quantity} درهم</div>
        `;
        orderItemsList.appendChild(itemDiv);
      });
    } else {
      orderItemsList.innerHTML = `
        <div style="text-align: center; padding: 1rem; color: var(--text); opacity: 0.6;">
          <i class="fas fa-info-circle"></i>
          <p>لا توجد أصناف في هذا الطلب</p>
        </div>
      `;
    }
    
    document.getElementById('orderModal').classList.add('active');
  }

  // تحديث عرض حالة الطلب
  updateOrderStatusDisplay(status) {
    const statusSelect = document.getElementById('statusSelect');
    statusSelect.value = status;
    
    const orderStatusSpan = document.getElementById('orderStatus');
    orderStatusSpan.innerHTML = '';
    
    let statusText = '';
    let badgeClass = '';
    
    switch (status) {
      case 'pending':
        statusText = 'جديد';
        badgeClass = 'badge-warning';
        break;
      case 'preparing':
        statusText = 'قيد التحضير';
        badgeClass = 'badge-primary';
        break;
      case 'completed':
        statusText = 'مكتمل';
        badgeClass = 'badge-success';
        break;
      case 'cancelled':
        statusText = 'ملغى';
        badgeClass = 'badge-danger';
        break;
      default:
        statusText = status;
        badgeClass = 'badge-secondary';
    }
    
    const badge = document.createElement('span');
    badge.className = `badge ${badgeClass}`;
    badge.textContent = statusText;
    orderStatusSpan.appendChild(badge);
  }

  // إغلاق مودال الطلب
  closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
    this.currentOrder = null;
  }

  // تحديث الإحصائيات
  updateStats() {
    let totalOrders = this.orders.length;
    let pendingOrders = this.orders.filter(o => o.status === 'pending').length;
    let completedOrders = this.orders.filter(o => o.status === 'completed').length;
    let totalSales = this.orders.filter(o => o.status === 'completed')
                          .reduce((sum, o) => sum + (o.total || 0), 0);
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('completedOrders').textContent = completedOrders;
    document.getElementById('totalSales').textContent = totalSales + ' درهم';
  }

  // إظهار إشعار للطلب الجديد
  showNewOrderNotification(order) {
    if (order.status === 'pending') {
      try {
        const notificationSound = document.getElementById('notificationSound');
        notificationSound.currentTime = 0;
        notificationSound.play().catch(e => console.log('Cannot play sound: ', e));
      } catch (e) {
        console.log('Sound error: ', e);
      }
      
      toastr.info(`طلب جديد في الطاولة رقم ${order.table || 'غير معروف'}`, 'تنبيه', {
        onclick: () => {
          this.filterOrdersByStatus('pending');
          this.openOrderModal(order);
        }
      });
    }
  }

  // تبديل الصفحات
  togglePages(showStats) {
    const ordersPage = document.querySelector('.main-content');
    const statsPage = document.getElementById('statsPage');
    const ordersLink = document.getElementById('ordersLink');
    const statsLink = document.getElementById('statsLink');
    
    if (showStats) {
      ordersPage.style.display = 'none';
      statsPage.style.display = 'block';
      ordersLink.classList.remove('active');
      statsLink.classList.add('active');
      this.loadStatistics();
    } else {
      ordersPage.style.display = 'block';
      statsPage.style.display = 'none';
      ordersLink.classList.add('active');
      statsLink.classList.remove('active');
    }
  }

  // تحميل بيانات الإحصائيات
  loadStatistics() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    document.getElementById('startDate').value = this.formatDateForInput(oneMonthAgo);
    document.getElementById('endDate').value = this.formatDateForInput(today);
    
    this.calculateStatistics();
    this.renderWeeklySalesChart();
  }

  // إعادة تعيين فلتر التاريخ
  resetDateFilter() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    document.getElementById('startDate').value = this.formatDateForInput(oneMonthAgo);
    document.getElementById('endDate').value = this.formatDateForInput(today);
    
    this.calculateStatistics();
  }

  // حساب الإحصائيات
  calculateStatistics() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const filteredOrders = this.orders.filter(order => {
      if (order.status !== 'completed') return false;
      const orderDate = new Date(order.timestamp);
      return orderDate >= start && orderDate <= end;
    });
    
    const dailySales = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.timestamp).toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = {
          date: date,
          total: 0,
          count: 0
        };
      }
      dailySales[date].total += order.total || 0;
      dailySales[date].count++;
    });
    
    this.dailySalesData = Object.values(dailySales).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const popularItems = {};
    filteredOrders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (!popularItems[item.plat]) {
            popularItems[item.plat] = {
              name: item.plat,
              quantity: 0,
              total: 0
            };
          }
          popularItems[item.plat].quantity += item.quantity;
          popularItems[item.plat].total += item.prix * item.quantity;
        });
      }
    });
    
    this.popularItemsData = Object.values(popularItems).sort((a, b) => b.quantity - a.quantity);
    
    this.calculatePreviousPeriodData(start, end);
    this.updateStatisticsUI();
  }

  // حساب بيانات الفترة السابقة للمقارنة
  calculatePreviousPeriodData(currentStart, currentEnd) {
    const periodDuration = currentEnd - currentStart;
    const previousStart = new Date(currentStart.getTime() - periodDuration - 86400000);
    const previousEnd = new Date(currentStart.getTime() - 86400000);
    
    const previousOrders = this.orders.filter(order => {
      if (order.status !== 'completed') return false;
      const orderDate = new Date(order.timestamp);
      return orderDate >= previousStart && orderDate <= previousEnd;
    });
    
    this.previousPeriodData = {
      totalSales: previousOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      totalOrders: previousOrders.length,
      avgOrderValue: previousOrders.length > 0 ? 
        previousOrders.reduce((sum, order) => sum + (order.total || 0), 0) / previousOrders.length : 0
    };
  }

  // تحديث واجهة الإحصائيات
  updateStatisticsUI() {
    const totalSales = this.dailySalesData.reduce((sum, day) => sum + day.total, 0);
    const totalOrders = this.dailySalesData.reduce((sum, day) => sum + day.count, 0);
    const avgDailySales = this.dailySalesData.length > 0 ? totalSales / this.dailySalesData.length : 0;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const bestDay = this.dailySalesData.length > 0 ? 
      this.dailySalesData.reduce((max, day) => day.total > max.total ? day : max, this.dailySalesData[0]) : 
      { total: 0, date: 'لا يوجد بيانات' };
    
    document.getElementById('totalSalesStats').textContent = totalSales.toLocaleString('en-US') + ' درهم';
    document.getElementById('avgDailySales').textContent = avgDailySales.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' درهم';
    document.getElementById('bestDaySales').textContent = bestDay.total.toLocaleString('en-US') + ' درهم';
    
    this.updatePerformanceComparison(totalSales, totalOrders, avgOrderValue);
    
    const dailySalesTable = document.getElementById('dailySalesTable');
    if (this.dailySalesData.length > 0) {
      dailySalesTable.innerHTML = this.dailySalesData.map(day => {
        const avgOrderValue = day.count > 0 ? day.total / day.count : 0;
        return `
          <tr>
            <td>${this.formatDateForDisplay(day.date)}</td>
            <td>${day.count}</td>
            <td>${day.total.toLocaleString('en-US')} درهم</td>
            <td>${avgOrderValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} درهم</td>
          </tr>
        `;
      }).join('');
    } else {
      dailySalesTable.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text); opacity: 0.6;">
            <i class="fas fa-info-circle"></i>
            <p>لا توجد بيانات في النطاق الزمني المحدد</p>
          </td>
        </tr>
      `;
    }
    
    const popularItemsGrid = document.getElementById('popularItemsGrid');
    if (this.popularItemsData.length > 0) {
      popularItemsGrid.innerHTML = this.popularItemsData.slice(0, 6).map(item => `
        <div class="popular-item-card">
          <div class="popular-item-name">${item.name}</div>
          <div class="popular-item-stats">
            <div class="popular-item-stat">
              <div class="popular-item-stat-value">${item.quantity}</div>
              <div class="popular-item-stat-label">الكمية</div>
            </div>
            <div class="popular-item-stat">
              <div class="popular-item-stat-value">${item.total.toLocaleString('en-US')}</div>
              <div class="popular-item-stat-label">إجمالي المبيعات</div>
            </div>
            <div class="popular-item-stat">
              <div class="popular-item-stat-value">${Math.round(item.total / item.quantity).toLocaleString('en-US')}</div>
              <div class="popular-item-stat-label">متوسط السعر</div>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      popularItemsGrid.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text); opacity: 0.6; grid-column: 1 / -1;">
          <i class="fas fa-info-circle"></i>
          <p>لا توجد بيانات عن الأطباق المطلوبة</p>
        </div>
      `;
    }
    
    this.renderDailySalesChart();
  }

  // تحديث مقارنة الأداء
  updatePerformanceComparison(currentSales, currentOrders, currentAvgOrder) {
    if (!this.previousPeriodData || this.previousPeriodData.totalSales === 0) {
      document.getElementById('salesComparison').textContent = '100%';
      document.getElementById('ordersComparison').textContent = '100%';
      document.getElementById('avgOrderComparison').textContent = '100%';
      
      document.getElementById('salesTrend').innerHTML = `
        <i class="fas fa-chart-line positive-change"></i>
        <span class="positive-change">بيانات جديدة</span>
      `;
      
      document.getElementById('ordersTrend').innerHTML = `
        <i class="fas fa-chart-line positive-change"></i>
        <span class="positive-change">بيانات جديدة</span>
      `;
      
      document.getElementById('avgOrderTrend').innerHTML = `
        <i class="fas fa-chart-line positive-change"></i>
        <span class="positive-change">بيانات جديدة</span>
      `;
      return;
    }
    
    const salesChange = ((currentSales - this.previousPeriodData.totalSales) / this.previousPeriodData.totalSales) * 100;
    const ordersChange = ((currentOrders - this.previousPeriodData.totalOrders) / this.previousPeriodData.totalOrders) * 100;
    const avgOrderChange = ((currentAvgOrder - this.previousPeriodData.avgOrderValue) / this.previousPeriodData.avgOrderValue) * 100;
    
    document.getElementById('salesComparison').textContent = `${Math.abs(salesChange).toFixed(1)}%`;
    document.getElementById('ordersComparison').textContent = `${Math.abs(ordersChange).toFixed(1)}%`;
    document.getElementById('avgOrderComparison').textContent = `${Math.abs(avgOrderChange).toFixed(1)}%`;
    
    this.updateComparisonTrend('sales', salesChange);
    this.updateComparisonTrend('orders', ordersChange);
    this.updateComparisonTrend('avgOrder', avgOrderChange);
  }

  // تحديث اتجاه المقارنة
  updateComparisonTrend(type, change) {
    const trendElement = document.getElementById(`${type}Trend`);
    
    if (change > 0) {
      trendElement.innerHTML = `
        <i class="fas fa-arrow-up positive-change"></i>
        <span class="positive-change">زيادة ${Math.abs(change).toFixed(1)}%</span>
      `;
    } else if (change < 0) {
      trendElement.innerHTML = `
        <i class="fas fa-arrow-down negative-change"></i>
        <span class="negative-change">انخفاض ${Math.abs(change).toFixed(1)}%</span>
      `;
    } else {
      trendElement.innerHTML = `
        <i class="fas fa-equals neutral-change"></i>
        <span class="neutral-change">لا يوجد تغيير</span>
      `;
    }
  }

  // رسم المخطط الأسبوعي
  renderWeeklySalesChart() {
    const weeklyData = this.prepareWeeklyData();
    const ctx = document.getElementById('weeklySalesChart').getContext('2d');
    
    if (this.weeklySalesChart) {
      this.weeklySalesChart.destroy();
    }
    
    const labels = weeklyData.map(day => this.formatDateForDisplay(day.date));
    const salesData = weeklyData.map(day => day.total);
    const ordersData = weeklyData.map(day => day.count);
    
    this.weeklySalesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'المبيعات اليومية (درهم)',
            data: salesData,
            borderColor: 'rgba(212, 175, 55, 1)',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'عدد الطلبات',
            data: ordersData,
            borderColor: 'rgba(26, 26, 46, 1)',
            backgroundColor: 'rgba(26, 26, 46, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'المبيعات وعدد الطلبات خلال 7 أيام'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.datasetIndex === 0) {
                  label += context.raw.toLocaleString('en-US') + ' درهم';
                } else {
                  label += context.raw;
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'المبيعات (درهم)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'عدد الطلبات'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }

  // رسم المخطط اليومي
  renderDailySalesChart() {
    const ctx = document.getElementById('dailySalesChart').getContext('2d');
    
    if (this.dailySalesChart) {
      this.dailySalesChart.destroy();
    }
    
    const labels = this.dailySalesData.map(day => this.formatDateForDisplay(day.date));
    const salesData = this.dailySalesData.map(day => day.total);
    const ordersCountData = this.dailySalesData.map(day => day.count);
    
    this.dailySalesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'المبيعات اليومية (درهم)',
            data: salesData,
            backgroundColor: 'rgba(212, 175, 55, 0.7)',
            borderColor: 'rgba(212, 175, 55, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'عدد الطلبات',
            data: ordersCountData,
            type: 'line',
            borderColor: 'rgba(26, 26, 46, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(26, 26, 46, 1)',
            pointRadius: 4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'المبيعات اليومية وعدد الطلبات'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.datasetIndex === 0) {
                  label += context.raw.toLocaleString('en-US') + ' درهم';
                } else {
                  label += context.raw;
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'المبيعات (درهم)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'عدد الطلبات'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }

  // تجهيز بيانات الأسبوع
  prepareWeeklyData() {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    
    const weeklyOrders = this.orders.filter(order => {
      if (order.status !== 'completed') return false;
      const orderDate = new Date(order.timestamp);
      return orderDate >= sevenDaysAgo && orderDate <= today;
    });
    
    const dailyData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        total: 0,
        count: 0
      };
    }
    
    weeklyOrders.forEach(order => {
      const date = new Date(order.timestamp).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].total += order.total || 0;
        dailyData[date].count++;
      }
    });
    
    return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // طباعة التقرير الأسبوعي
  printWeeklyReport() {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    
    if (!printWindow || printWindow.closed) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الطباعة',
        text: 'لم يتم فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }

    const weeklyData = this.prepareWeeklyData();
    const totalWeeklySales = weeklyData.reduce((sum, day) => sum + day.total, 0);
    const totalWeeklyOrders = weeklyData.reduce((sum, day) => sum + day.count, 0);
    const avgDailySales = totalWeeklySales / 7;
    const bestDay = weeklyData.reduce((max, day) => day.total > max.total ? day : max, weeklyData[0]);
    
    let tableContent = '';
    weeklyData.forEach(day => {
      tableContent += `
        <tr>
          <td>${this.formatDateForDisplay(day.date)}</td>
          <td>${day.count}</td>
          <td>${day.total.toLocaleString('en-US')} درهم</td>
          <td>${day.count > 0 ? Math.round(day.total / day.count).toLocaleString('en-US') : 0} درهم</td>
        </tr>
      `;
    });

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير المبيعات الأسبوعي - Demo</title>
        <style>
          body { font-family: 'Tajawal', sans-serif; padding: 20px; }
          h1, h2 { color: #1A1A2E; text-align: center; }
          h1 { margin-bottom: 5px; font-size: 24px; }
          h2 { margin-top: 0; margin-bottom: 20px; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; text-align: right; border: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 20px 0; }
          .summary-card { background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #ddd; }
          .summary-value { font-size: 1.5rem; font-weight: bold; color: #D4AF37; margin: 10px 0; }
          .print-date { text-align: left; margin-bottom: 20px; font-size: 14px; }
          .logo { text-align: center; margin-bottom: 20px; }
          .logo img { max-width: 150px; }
          @page { size: auto; margin: 10mm; }
        </style>
      </head>
      <body>
        <div class="print-content">
          <div class="logo">
            <h1 style="color: #D4AF37; font-size: 28px; margin-bottom: 5px;">Demo</h1>
            <h2 style="color: #1A1A2E; margin-top: 0;">تقرير المبيعات الأسبوعي</h2>
          </div>
          
          <div class="print-date">تاريخ الطباعة: ${new Date().toLocaleString('en-US')}</div>
          <div class="print-date">الفترة من ${this.formatDateForDisplay(weeklyData[0].date)} إلى ${this.formatDateForDisplay(weeklyData[6].date)}</div>
          
          <div class="summary-cards">
            <div class="summary-card">
              <div>إجمالي المبيعات</div>
              <div class="summary-value">${totalWeeklySales.toLocaleString('en-US')} درهم</div>
            </div>
            <div class="summary-card">
              <div>عدد الطلبات</div>
              <div class="summary-value">${totalWeeklyOrders}</div>
            </div>
            <div class="summary-card">
              <div>متوسط المبيعات اليومية</div>
              <div class="summary-value">${avgDailySales.toLocaleString('en-US', { maximumFractionDigits: 0 })} درهم</div>
            </div>
            <div class="summary-card">
              <div>أفضل يوم مبيعات</div>
              <div class="summary-value">${bestDay.total.toLocaleString('en-US')} درهم</div>
            </div>
          </div>
          
          <h3 style="border-bottom: 2px solid #1A1A2E; padding-bottom: 5px;">المبيعات اليومية</h3>
          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>عدد الطلبات</th>
                <th>إجمالي المبيعات</th>
                <th>متوسط قيمة الطلب</th>
              </tr>
            </thead>
            <tbody>
              ${tableContent}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: left; font-size: 12px; color: #666;">
            <p>تم إنشاء هذا التقرير تلقائياً من نظام إدارة المطعم Demo</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function() {
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            if (!printWindow.closed) {
              printWindow.close();
            }
          }, 1000);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'خطأ في الطباعة',
            text: 'حدث خطأ أثناء الطباعة: ' + error.message,
            confirmButtonColor: '#D4AF37'
          });
          if (!printWindow.clapsed) {
            printWindow.close();
          }
        }
      }, 1000);
    };
  }

  // طباعة تقرير الإحصائيات
  printStatisticsReport() {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    
    if (!printWindow || printWindow.closed) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الطباعة',
        text: 'لم يتم فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const totalSales = this.dailySalesData.reduce((sum, day) => sum + day.total, 0);
    const totalOrders = this.dailySalesData.reduce((sum, day) => sum + day.count, 0);
    const avgDailySales = this.dailySalesData.length > 0 ? totalSales / this.dailySalesData.length : 0;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const bestDay = this.dailySalesData.length > 0 ? 
      this.dailySalesData.reduce((max, day) => day.total > max.total ? day : max, this.dailySalesData[0]) : 
      { total: 0, date: 'لا يوجد بيانات' };
    
    const mostPopularItem = this.popularItemsData.length > 0 ? this.popularItemsData[0] : null;
    
    let performanceComparison = '';
    if (this.previousPeriodData) {
      const salesChange = ((totalSales - this.previousPeriodData.totalSales) / this.previousPeriodData.totalSales) * 100;
      const ordersChange = ((totalOrders - this.previousPeriodData.totalOrders) / this.previousPeriodData.totalOrders) * 100;
      const avgOrderChange = ((avgOrderValue - this.previousPeriodData.avgOrderValue) / this.previousPeriodData.avgOrderValue) * 100;
      
      performanceComparison = `
        <div style="margin-top: 20px;">
          <h3 style="border-bottom: 2px solid #1A1A2E; padding-bottom: 5px;">مقارنة الأداء مع الفترة السابقة</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 15px;">
            <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #ddd;">
              <div style="font-weight: bold;">المبيعات</div>
              <div style="font-size: 1.2rem; margin: 10px 0; color: ${salesChange >= 0 ? '#4CAF50' : '#F44336'};">
                ${salesChange >= 0 ? '↑' : '↓'} ${Math.abs(salesChange).toFixed(1)}%
              </div>
            </div>
            <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #ddd;">
              <div style="font-weight: bold;">عدد الطلبات</div>
              <div style="font-size: 1.2rem; margin: 10px 0; color: ${ordersChange >= 0 ? '#4CAF50' : '#F44336'};">
                ${ordersChange >= 0 ? '↑' : '↓'} ${Math.abs(ordersChange).toFixed(1)}%
              </div>
            </div>
            <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #ddd;">
              <div style="font-weight: bold;">متوسط الطلب</div>
              <div style="font-size: 1.2rem; margin: 10px 0; color: ${avgOrderChange >= 0 ? '#4CAF50' : '#F44336'};">
                ${avgOrderChange >= 0 ? '↑' : '↓'} ${Math.abs(avgOrderChange).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    let printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير إحصائيات المبيعات - Demo</title>
        <style>
          body { font-family: 'Tajawal', sans-serif; padding: 20px; }
          h1, h2 { color: #1A1A2E; text-align: center; }
          h1 { margin-bottom: 5px; font-size: 24px; }
          h2 { margin-top: 0; margin-bottom: 20px; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; text-align: right; border: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 20px 0; }
          .summary-card { background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #ddd; }
          .summary-value { font-size: 1.5rem; font-weight: bold; color: #D4AF37; margin: 10px 0; }
          .print-date { text-align: left; margin-bottom: 20px; font-size: 14px; }
          .logo { text-align: center; margin-bottom: 20px; }
          .logo img { max-width: 150px; }
          @page { size: auto; margin: 10mm; }
        </style>
      </head>
      <body>
        <div class="print-content">
          <div class="logo">
            <h1 style="color: #D4AF37; font-size: 28px; margin-bottom: 5px;">Demo</h1>
            <h2 style="color: #1A1A2E; margin-top: 0;">تقرير إحصائيات المبيعات</h2>
          </div>
          
          <div class="print-date">تاريخ الطباعة: ${new Date().toLocaleString('en-US')}</div>
          <div class="print-date">الفترة من ${this.formatDateForDisplay(startDate)} إلى ${this.formatDateForDisplay(endDate)}</div>
          
          <div class="summary-cards">
            <div class="summary-card">
              <div>إجمالي المبيعات</div>
              <div class="summary-value">${totalSales.toLocaleString('en-US')} درهم</div>
            </div>
            <div class="summary-card">
              <div>عدد الطلبات</div>
              <div class="summary-value">${totalOrders}</div>
            </div>
            <div class="summary-card">
              <div>متوسط قيمة الطلب</div>
              <div class="summary-value">${avgOrderValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} درهم</div>
            </div>
          </div>
          
          ${performanceComparison}
          
          <h3 style="border-bottom: 2px solid #1A1A2E; padding-bottom: 5px;">المبيعات اليومية</h3>
          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>عدد الطلبات</th>
                <th>إجمالي المبيعات</th>
                <th>متوسط قيمة الطلب</th>
              </tr>
            </thead>
            <tbody>
    `;

    this.dailySalesData.forEach(day => {
      const avgOrderValue = day.count > 0 ? day.total / day.count : 0;
      printContent += `
        <tr>
          <td>${this.formatDateForDisplay(day.date)}</td>
          <td>${day.count}</td>
          <td>${day.total.toLocaleString('en-US')} درهم</td>
          <td>${avgOrderValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} درهم</td>
        </tr>
      `;
    });

    printContent += `
            </tbody>
          </table>
          
          <h3 style="border-bottom: 2px solid #1A1A2E; padding-bottom: 5px; margin-top: 30px;">الأطباق الأكثر مبيعاً</h3>
          <table>
            <thead>
              <tr>
                <th>اسم الطبق</th>
                <th>الكمية</th>
                <th>إجمالي المبيعات</th>
                <th>متوسط السعر</th>
              </tr>
            </thead>
            <tbody>
    `;

    this.popularItemsData.slice(0, 10).forEach(item => {
      printContent += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.total.toLocaleString('en-US')} درهم</td>
          <td>${Math.round(item.total / item.quantity).toLocaleString('en-US')} درهم</td>
        </tr>
      `;
    });

    printContent += `
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: left; font-size: 12px; color: #666;">
            <p>تم إنشاء هذا التقرير تلقائياً من نظام إدارة المطعم Demo</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function() {
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            if (!printWindow.closed) {
              printWindow.close();
            }
          }, 1000);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'خطأ في الطباعة',
            text: 'حدث خطأ أثناء الطباعة: ' + error.message,
            confirmButtonColor: '#D4AF37'
          });
          if (!printWindow.closed) {
            printWindow.close();
          }
        }
      }, 1000);
    };
  }

  // طباعة السجل الكامل
  printAllOrders() {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    
    if (!printWindow || printWindow.closed) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الطباعة',
        text: 'لم يتم فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }

    const today = new Date().toLocaleDateString('en-US');
    let todayOrders = 0;
    let todaySales = 0;
    const popularItems = {};
    
    this.orders.forEach(order => {
      const orderDate = new Date(order.timestamp).toLocaleDateString('en-US');
      if (orderDate === today) {
        todayOrders++;
        todaySales += order.total || 0;
      }
      
      if (order.items) {
        order.items.forEach(item => {
          if (popularItems[item.plat]) {
            popularItems[item.plat] += item.quantity;
          } else {
            popularItems[item.plat] = item.quantity;
          }
        });
      }
    });
    
    const popularItemsArray = Object.entries(popularItems)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    let printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير الطلبات - Demo</title>
        <style>
          body { font-family: 'Tajawal', sans-serif; padding: 20px; }
          h1, h2 { color: #1A1A2E; text-align: center; }
          h1 { margin-bottom: 5px; font-size: 24px; }
          h2 { margin-top: 0; margin-bottom: 20px; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; text-align: right; border: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .badge { padding: 3px 8px; border-radius: 50px; font-size: 12px; }
          .badge-warning { background-color: #fff3cd; color: #856404; }
          .badge-primary { background-color: #cce5ff; color: #004085; }
          .badge-success { background-color: #d4edda; color: #155724; }
          .badge-danger { background-color: #f8d7da; color: #721c24; }
          .print-date { text-align: left; margin-bottom: 20px; font-size: 14px; }
          .stats-section { margin: 20px 0; }
          .stat-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
          .stat-label { font-weight: bold; }
          .logo { text-align: center; margin-bottom: 20px; }
          .logo img { max-width: 150px; }
          @page { size: auto; margin: 10mm; }
        </style>
      </head>
      <body>
        <div class="print-content">
          <div class="logo">
            <h1 style="color: #D4AF37; font-size: 28px; margin-bottom: 5px;">Demo</h1>
            <h2 style="color: #1A1A2E; margin-top: 0;">تقرير الطلبات والإحصائيات</h2>
          </div>
          
          <div class="print-date">تاريخ الطباعة: ${new Date().toLocaleString('en-US')}</div>
          
          <div class="stats-section">
            <h3 style="border-bottom: 2px solid #1A1A2E; padding-bottom: 5px;">إحصائيات اليوم (${today})</h3>
            <div class="stat-row">
              <span class="stat-label">عدد الطلبات اليوم:</span>
              <span>${todayOrders}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">إجمالي المبيعات اليوم:</span>
              <span>${todaySales} درهم</span>
            </div>
          </div>
          
          <div class="stats-section">
            <h3 style="border-bottom: 2px solid #1A1A2E; padding-bottom: 5px;">الأطباق الأكثر طلباً</h3>
            ${popularItemsArray.length > 0 ? 
              popularItemsArray.map(item => `
                <div class="stat-row">
                  <span>${item[0]}</span>
                  <span>${item[1]} طلب</span>
                </div>
              `).join('') : 
              '<p>لا توجد بيانات عن الأطباق المطلوبة</p>'}
          </div>
          
          <h3 style="border-bottom: 2px solid #1A1A2E; padding-bottom: 5px;">تفاصيل جميع الطلبات</h3>
          <table>
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>رقم الطاولة</th>
                <th>الوقت</th>
                <th>المجموع</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
    `;

    this.orders.forEach(order => {
      let statusText = '';
      let badgeClass = '';
      
      switch (order.status) {
        case 'pending':
          statusText = 'جديد';
          badgeClass = 'badge-warning';
          break;
        case 'preparing':
          statusText = 'قيد التحضير';
          badgeClass = 'badge-primary';
          break;
        case 'completed':
          statusText = 'مكتمل';
          badgeClass = 'badge-success';
          break;
        case 'cancelled':
          statusText = 'ملغى';
          badgeClass = 'badge-danger';
          break;
        default:
          statusText = order.status || 'غير معروف';
          badgeClass = 'badge-secondary';
      }
      
      printContent += `
        <tr>
          <td>${order.id || '-'}</td>
          <td>${order.table || '-'}</td>
          <td>${this.formatDateTime(order.timestamp)}</td>
          <td>${order.total || '0'} درهم</td>
          <td><span class="badge ${badgeClass}">${statusText}</span></td>
        </tr>
      `;
    });

    printContent += `
            </tbody>
          </table>
          <div style="margin-top: 30px; text-align: left; font-size: 12px; color: #666;">
            <p>تم إنشاء هذا التقرير تلقائياً من نظام إدارة المطعم Demo</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function() {
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            if (!printWindow.closed) {
              printWindow.close();
            }
          }, 1000);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'خطأ في الطباعة',
            text: 'حدث خطأ أثناء الطباعة: ' + error.message,
            confirmButtonColor: '#D4AF37'
          });
          if (!printWindow.closed) {
            printWindow.close();
          }
        }
      }, 1000);
    };
  }

  // طباعة طلب واحد
  printOrder() {
    if (!this.currentOrder) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow || printWindow.closed) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الطباعة',
        text: 'لم يتم فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }

    let statusText = '';
    let badgeClass = '';
    
    switch (this.currentOrder.status) {
      case 'pending':
        statusText = 'جديد';
        badgeClass = 'badge-warning';
        break;
      case 'preparing':
        statusText = 'قيد التحضير';
        badgeClass = 'badge-primary';
        break;
      case 'completed':
        statusText = 'مكتمل';
        badgeClass = 'badge-success';
        break;
      case 'cancelled':
        statusText = 'ملغى';
        badgeClass = 'badge-danger';
        break;
      default:
        statusText = this.currentOrder.status || 'غير معروف';
        badgeClass = 'badge-secondary';
    }

    let itemsContent = '';
    if (this.currentOrder.items && this.currentOrder.items.length > 0) {
      this.currentOrder.items.forEach(item => {
        itemsContent += `
          <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px; font-size: 14px;">
            <div>${item.plat} × ${item.quantity}</div>
            <div style="font-weight: bold;">${item.prix * item.quantity} درهم</div>
          </div>
        `;
      });
    } else {
      itemsContent = '<p style="text-align: center; padding: 10px; color: #666;">لا توجد أصناف في هذا الطلب</p>';
    }

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تفاصيل الطلب #${this.currentOrder.id} - Demo</title>
        <style>
          body { font-family: 'Tajawal', sans-serif; padding: 20px; }
          h1 { color: #D4AF37; text-align: center; font-size: 24px; margin-bottom: 5px; }
          h2 { color: #1A1A2E; text-align: center; font-size: 18px; margin-top: 0; margin-bottom: 20px; }
          .order-details-row { display: flex; margin-bottom: 12px; font-size: 14px; }
          .order-details-label { font-weight: bold; min-width: 120px; }
          .badge { padding: 4px 10px; border-radius: 50px; font-size: 12px; }
          .badge-warning { background-color: #fff3cd; color: #856404; }
          .badge-primary { background-color: #cce5ff; color: #004085; }
          .badge-success { background-color: #d4edda; color: #155724; }
          .badge-danger { background-color: #f8d7da; color: #721c24; }
          .order-total { font-weight: bold; font-size: 18px; text-align: left; margin: 20px 0; padding-top: 20px; border-top: 2px solid #ddd; }
          .logo { text-align: center; margin-bottom: 20px; }
          .logo img { max-width: 150px; }
          @page { size: auto; margin: 10mm; }
        </style>
      </head>
      <body>
        <div class="logo">
          <h1>Demo</h1>
          <h2>تفاصيل الطلب #${this.currentOrder.id}</h2>
        </div>
        
        <div class="order-details-row">
          <div class="order-details-label">رقم الطاولة:</div>
          <div>${this.currentOrder.table || '-'}</div>
        </div>
        <div class="order-details-row">
          <div class="order-details-label">حالة الطلب:</div>
          <div><span class="badge ${badgeClass}">${statusText}</span></div>
        </div>
        <div class="order-details-row">
          <div class="order-details-label">وقت الطلب:</div>
          <div>${this.formatDateTime(this.currentOrder.timestamp)}</div>
        </div>
        <div class="order-details-row">
          <div class="order-details-label">ملاحظات:</div>
          <div>${this.currentOrder.notes || 'لا توجد ملاحظات'}</div>
        </div>
        
        <h3 style="border-bottom: 2px solid #1A1A2E; padding-bottom: 5px; margin-top: 20px;">الأصناف المطلوبة:</h3>
        ${itemsContent}
        
        <div class="order-total">
          المجموع: ${this.currentOrder.total || '0'} درهم
        </div>
        
        <div style="margin-top: 30px; text-align: left; font-size: 12px; color: #666;">
          <p>تم إنشاء هذا التقرير تلقائياً من نظام إدارة المطعم Demo</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function() {
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            if (!printWindow.closed) {
              printWindow.close();
            }
          }, 1000);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'خطأ في الطباعة',
            text: 'حدث خطأ أثناء الطباعة: ' + error.message,
            confirmButtonColor: '#D4AF37'
          });
          if (!printWindow.closed) {
            printWindow.close();
          }
        }
      }, 1000);
    };
  }

  // إعادة تعيين جميع الطلبات
  resetAllOrders() {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف جميع الطلبات والإحصائيات بشكل دائم!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذف الكل',
      cancelButtonText: 'إلغاء',
      backdrop: `
        rgba(0,0,0,0.7)
        url("https://i.gifer.com/7efs.gif")
        center top
        no-repeat
      `
    }).then((result) => {
      if (result.isConfirmed) {
        const ordersRef = ref(this.database, 'orders');
        
        remove(ordersRef)
          .then(() => {
            Swal.fire(
              'تم الحذف!',
              'تم حذف جميع الطلبات بنجاح.',
              'success'
            );
            this.lastOrdersCount = 0;
            this.lastPendingCount = 0;
            this.orders = [];
            this.updateStats();
            this.displayOrders([]);
          })
          .catch((error) => {
            Swal.fire(
              'خطأ!',
              'حدث خطأ أثناء الحذف: ' + error.message,
              'error'
            );
          });
      }
    });
  }

  // فتح ملف التعديل
  openModificationFile() {
    window.location.href = 'modification.html';
  }

  // تنسيق التاريخ والوقت
  formatDateTime(timestamp) {
    if (!timestamp) return '-';
    
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  // تحويل التاريخ إلى تنسيق YYYY-MM-DD
  formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // تنسيق التاريخ للعرض
  formatDateForDisplay(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}

// بدء تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  new DashboardApp();
  
  // تهيئة Toastr
  toastr.options = {
    closeButton: false,
    progressBar: false,
    positionClass: 'toast-top-left',
    rtl: true,
    timeOut: 3000,
    extendedTimeOut: 1000,
    preventDuplicates: true,
    newestOnTop: true
  };
});

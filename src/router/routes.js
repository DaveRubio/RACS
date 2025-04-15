const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'signup',
        name: 'Signup',
        component: () => import('pages/SignupPage.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/LoginLayout.vue'), // Use LoginLayout for AdminLoginPage
    children: [
      {
        path: '',
        name: 'AdminLogin',
        component: () => import('pages/AdminLoginPage.vue'),
      },
    ],
  },
  {
    path: '/admin-panel',
    component: () => import('layouts/AdminLayout.vue'), // Use AdminLayout for other admin pages
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('pages/Admin/AdminDashboardPage.vue'),
      },
      {
        path: 'continuing',
        name: 'AdminContinuing',
        component: () => import('pages/Admin/AdminContinuingPage.vue'),
      },
      {
        path: 'logs',
        name: 'AdminLogs',
        component: () => import('pages/Admin/AdminLogsPage.vue'),
      },
      {
        path: 'user-access',
        name: 'UserAccess',
        component: () => import('pages/Admin/UserAccessPage.vue'),
      },
      {
        path: 'user-control-accepted',
        name: 'UserControlAccepted',
        component: () => import('pages/Admin/UserControlAcceptedPage.vue'),
      },
      {
        path: 'user-control-pending',
        name: 'UserControlPending',
        component: () => import('pages/Admin/UserControlPendingPage.vue'),
      },
    ],
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('pages/DashBoard.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'transactions',
        name: 'Transactions',
        redirect: '/home/transactions/appropriation',
        children: [
          {
            path: 'appropriation',
            name: 'Appropriation',
            component: () => import('pages/Transaction/AppropriationTran.vue'),
          },
          {
            path: 'disbursement',
            name: 'Disbursement',
            component: () => import('pages/Transaction/DisbursementTran.vue'),
          },
          {
            path: 'augmentation',
            name: 'Augmentation',
            component: () => import('pages/Transaction/AugmentationTran.vue'),
          },
        ],
      },
      {
        path: 'continuing',
        name: 'Continuing',
        redirect: '/home/continuing/appropriation',
        children: [
          {
            path: 'appropriation',
            name: 'ContAppropriation',
            component: () => import('pages/Continuing/ContAppr.vue'),
          },
          {
            path: 'disbursement',
            name: 'ContDisbursement',
            component: () => import('pages/Continuing/ContDis.vue'),
          },
          {
            path: 'augmentation',
            name: 'ContAugmentation',
            component: () => import('pages/Continuing/ContAug.vue'),
          },
        ],
      },
      {
        path: 'libraries',
        name: 'Libraries',
        redirect: '/home/libraries/accounts',
        children: [
          {
            path: 'accounts',
            name: 'AccountsLib',
            component: () => import('pages/Libraries/AccountsLib.vue'),
          },
          {
            path: 'particulars',
            name: 'ParticularLib',
            component: () => import('pages/Libraries/ParticularsLib.vue'),
          },
          {
            path: 'bank',
            name: 'BankLib',
            component: () => import('pages/Libraries/BankLib.vue'),
          },
          {
            path: 'continuing',
            name: 'ContinuingLib',
            component: () => import('pages/Libraries/ContinuingLib.vue'),
          },
        ],
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('pages/ReportPage.vue'),
        meta: { title: 'Reports' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { title: 'Page Not Found' },
  },
]

export default routes

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
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Dashboard
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('pages/DashBoard.vue'),
        meta: { title: 'Dashboard' },
      },
      // Transactions
      {
        path: 'transactions',
        name: 'Transactions',
        redirect: '/home/transactions/appropriation', // Empty component for parent
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

      // Continuing
      {
        path: 'continuing',
        name: 'Continuing',
        redirect: '/home/continuing/appropriation', // Empty component for parent
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

      // Libraries
      {
        path: 'libraries',
        name: 'Libraries',
        redirect: '/home/libraries/accounts', // Empty component for parent
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
      // Reports
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('pages/ReportPage.vue'),
        meta: { title: 'Reports' },
      },
    ],
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { title: 'Page Not Found' },
  },
]

export default routes

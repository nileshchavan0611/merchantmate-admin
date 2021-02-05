import { adminRoot } from './defaultValues';

const data = [
  {
    id: 'merchant',
    icon: 'simple-icon-organization',
    label: 'menu.merchant-page',
    to: `${adminRoot}/merchant-page`,
  },
  {
    id: 'merchantprovider',
    icon: 'simple-icon-organization',
    label: 'menu.merchant-provider-page',
    to: `${adminRoot}/merchant-provider-page`,
  },
  {
    id: 'userpage',
    icon: 'simple-icon-organization',
    label: 'menu.user-page',
    to: `${adminRoot}/user-page`,
  },
];
export default data;

import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Overview',
        items: [
          {
            title: 'App',
            path: paths.dashboard.calendar,
            icon: ICONS.dashboard,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'Management',
        items: [
          // USER
          {
            title: 'User',
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: 'List', path: paths.dashboard.user.list },
              { title: 'Create', path: paths.dashboard.user.new },
            ],
          },
          // USER
          {
            title: 'Item',
            path: paths.dashboard.item.root,
            icon: ICONS.product,
            children: [
              { title: 'List', path: paths.dashboard.item.list },
              { title: 'Create', path: paths.dashboard.item.new },
            ],
          },


          // CALENDAR
          {
            title: 'Calendar',
            path: paths.dashboard.calendar,
            icon: ICONS.calendar,
          },

        ],
      },
    ],
    []
  );

  return data;
}

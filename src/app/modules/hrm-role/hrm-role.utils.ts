interface Module {
    name: string;
    permission: string;
    child?: Array<{ name: string; permission: string }>;
}

const crud = [
    {
        name: 'Create',
        permission: 'create',
    },
    {
        name: 'Edit',
        permission: 'edit',
    },
    {
        name: 'Delete',
        permission: 'delete',
    },
    {
        name: 'View',
        permission: 'view',
    },
];

const modules: Module[] = [
    {
        name: 'Dashboard',
        permission: 'dashboard',
        child: crud,
    },
    {
        name: 'Settings',
        permission: 'setting',
        child: crud,
    },
    {
        name: 'Languages',
        permission: 'language',
        child: crud,
    },
    {
        name: 'Products',
        permission: 'product',
        child: crud,
    },
    {
        name: 'Faqs',
        permission: 'faq',
        child: crud,
    },
    {
        name: 'Visas',
        permission: 'visa',
        child: crud,
    },
    {
        name: 'Subscribers',
        permission: 'subscriber',
        child: crud,
    },
    {
        name: 'Hrms',
        permission: 'hrm',
        child: crud,
    },
    {
        name: 'Blogs',
        permission: 'blog',
        child: crud,
    },
    {
        name: 'Hotels',
        permission: 'hotel',
        child: crud,
    },
    {
        name: 'Reviews',
        permission: 'review',
        child: crud,
    },
    {
        name: 'Contacts',
        permission: 'contact',
        child: crud,
    },
    {
        name: 'Destinations',
        permission: 'destination',
        child: crud,
    },
    {
        name: 'Packages',
        permission: 'package',
        child: crud,
    },
    {
        name: 'Offers',
        permission: 'offer',
        child: crud,
    },
    {
        name: 'Guides',
        permission: 'guide',
        child: crud,
    },
];

const permissions = modules?.map((m) => {
    if (m.child) {
        return {
            ...m,
            child: m.child?.map((c) => ({
                ...c,
                permission: `${m.permission}_${c.permission}`,
            })),
        };
    }
    return m;
});
export default permissions;

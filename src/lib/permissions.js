/**
 * Every permission a role can be granted, grouped the way the admin panel's
 * role editor shows them. The admin reads this catalog from GET /admin/roles,
 * so it is the only copy — add a permission here and gate a route with it.
 *
 * Team accounts and roles themselves are deliberately *not* grantable: they
 * stay super-admin only, so no custom role can escalate its own access.
 */
export const PERMISSION_GROUPS = [
  {
    key: 'leads',
    label: 'Leads',
    permissions: [
      { key: 'leads.view', label: 'View enquiries' },
      { key: 'leads.edit', label: 'Change status and add notes' },
      { key: 'leads.assign', label: 'Assign enquiries to roles and people' },
      { key: 'leads.export', label: 'Export to CSV' },
      { key: 'leads.delete', label: 'Delete enquiries' },
    ],
  },
  {
    key: 'content',
    label: 'Website',
    permissions: [
      { key: 'content.manage', label: 'Edit content collections (destinations, courses, blog…)' },
      { key: 'sections.edit', label: 'Edit section copy' },
      { key: 'sections.delete', label: 'Delete section copy' },
      { key: 'media.upload', label: 'Browse and upload media' },
      { key: 'media.delete', label: 'Delete media' },
    ],
  },
  {
    key: 'site',
    label: 'Site',
    permissions: [
      { key: 'settings.manage', label: 'Edit site settings and email, see recent activity' },
    ],
  },
];

export const PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.key));

// Who sees which enquiries: every lead, or only those assigned to the user or their role.
export const LEAD_SCOPES = ['all', 'assigned'];

export const SUPER_ADMIN = 'super_admin';

/**
 * Roles that always exist. They are inserted on boot if missing and never
 * overwritten, so edits made in the admin survive restarts.
 */
export const DEFAULT_ROLES = [
  {
    key: SUPER_ADMIN,
    name: 'Super admin',
    description: 'Everything, including team accounts and roles. Cannot be edited.',
    permissions: PERMISSIONS,
    leadScope: 'all',
    system: true,
  },
  {
    key: 'admin',
    name: 'Admin',
    description: 'Content, every lead and site settings.',
    permissions: PERMISSIONS,
    leadScope: 'all',
    system: true,
  },
  {
    key: 'editor',
    name: 'Editor',
    description: 'Website content only.',
    permissions: ['content.manage', 'sections.edit', 'media.upload'],
    leadScope: 'assigned',
    system: true,
  },
  {
    key: 'counsellor',
    name: 'Counsellor',
    description: 'Works the enquiries assigned to them or their role.',
    permissions: ['leads.view', 'leads.edit'],
    leadScope: 'assigned',
    system: false,
  },
];

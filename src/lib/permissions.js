import { RESOURCES } from './resourceRegistry.js';

/**
 * Permissions are per module, per action: `<module>.<action>`, e.g.
 * `destinations.edit`. Modules come from the resource registry plus the
 * hand-written screens, so a new content collection appears in the role editor
 * automatically. The admin reads this catalog from GET /admin/roles — it is the
 * only copy.
 *
 * Team accounts and roles themselves are deliberately *not* grantable: they
 * stay super-admin only, so no custom role can escalate its own access.
 */

export const ACTIONS = [
  { key: 'view', label: 'View' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

const mod = (key, label, { actions = ['view', 'edit', 'delete'], actionLabels, extras = [], note } = {}) => ({
  key,
  label,
  actions,
  actionLabels,
  extras,
  note,
});

export const MODULE_GROUPS = [
  {
    key: 'leads',
    label: 'Leads',
    modules: [
      mod('leads', 'Enquiries', {
        actionLabels: { edit: 'Change status & notes' },
        extras: [
          { key: 'leads.assign', label: 'Assign to roles and people' },
          { key: 'leads.export', label: 'Export CSV' },
          { key: 'leads.import', label: 'Add & import leads' },
        ],
        note: 'Which enquiries they see is set by "Can see" above.',
      }),
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    modules: [
      mod('finance', 'Expenses & P&L', {
        actionLabels: { edit: 'Add & edit entries' },
        note: 'Viewing includes the P&L statement and CSV export.',
      }),
    ],
  },
  {
    key: 'content',
    label: 'Website content',
    // Every content collection is its own module, in the registry's own order.
    modules: RESOURCES.map((r) => mod(r.name, r.label || r.name)),
  },
  {
    key: 'workspace',
    label: 'Team workspace',
    modules: [
      mod('formats', 'Message & email formats', {
        actionLabels: { edit: 'Add & edit formats' },
        note: 'The approved wording the team copies when replying to a lead.',
      }),
      mod('documents', 'Document library', {
        actionLabels: { edit: 'Upload documents' },
        note: 'Uploading is super-admin only unless you tick it for a role here.',
      }),
    ],
  },
  {
    key: 'site',
    label: 'Site',
    modules: [
      mod('sections', 'Section copy'),
      mod('media', 'Media library', { actionLabels: { edit: 'Upload' } }),
      mod('settings', 'Site settings & email', { actions: ['view', 'edit'] }),
    ],
  },
];

export const MODULES = MODULE_GROUPS.flatMap((g) => g.modules);

export const PERMISSIONS = MODULES.flatMap((m) => [
  ...m.actions.map((a) => `${m.key}.${a}`),
  ...m.extras.map((e) => e.key),
]);

/**
 * Pre-module permission keys, mapped to their replacements. Applied once to
 * every stored role on boot so existing roles keep exactly the access they had.
 */
export const LEGACY_PERMISSIONS = {
  'content.manage': RESOURCES.flatMap((r) => [`${r.name}.view`, `${r.name}.edit`, `${r.name}.delete`]),
  'sections.edit': ['sections.view', 'sections.edit'],
  'sections.delete': ['sections.delete'],
  'media.upload': ['media.view', 'media.edit'],
  'media.delete': ['media.delete'],
  'settings.manage': ['settings.view', 'settings.edit'],
};

// Who sees which enquiries: every lead, or only those assigned to the user or their role.
export const LEAD_SCOPES = ['all', 'assigned'];

export const SUPER_ADMIN = 'super_admin';

const CONTENT_KEYS = RESOURCES.map((r) => r.name);

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
    description: 'Every module and every lead.',
    permissions: PERMISSIONS,
    leadScope: 'all',
    system: true,
  },
  {
    key: 'editor',
    name: 'Editor',
    description: 'Website content only — no leads, no settings.',
    permissions: [
      ...CONTENT_KEYS.flatMap((k) => [`${k}.view`, `${k}.edit`]),
      'sections.view', 'sections.edit',
      'media.view', 'media.edit',
      'formats.view', 'documents.view',
    ],
    leadScope: 'assigned',
    system: true,
  },
  {
    key: 'counsellor',
    name: 'Counsellor',
    description: 'Works the enquiries assigned to them or their role.',
    permissions: ['leads.view', 'leads.edit', 'formats.view', 'documents.view'],
    leadScope: 'assigned',
    system: false,
  },
];

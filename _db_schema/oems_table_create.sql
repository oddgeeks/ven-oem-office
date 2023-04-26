
create type oem.oem_quotes_contacts_type_enum as enum ('End Customer', 'Partner Sales', 'Distributor Sales', 'Distributor Contact', 'Partner Contact', 'Technical Contact', 'Internal', 'Other');

create type oem.oem_vendos_contacts_type_enum as enum ('End Customer', 'Partner Sales', 'Distributor Sales', 'Distributor Contact', 'Partner Contact', 'Technical Contact', 'Internal', 'Other');

create type oem.oem_materials_package_position_enum as enum ('Before', 'After', 'Optional');

create type oem.oem_materials_applicable_to_enum as enum ('Quote', 'Vendo', 'Both');

create type oem.oem_hierarchy_levels_hierarchy_type_enum as enum ('User Geography', 'Product Level');

create type oem.oem_vendos_vendo_status_enum as enum ('Draft', 'Pending', 'Auto-Approved', 'Approved', 'Rejected', 'Expired', 'Transacted');

create type oem.oem_vendo_approval_queues_status_enum as enum ('Pending', 'Approved', 'Rejected', 'Expired');

create type oem.oem_quote_approval_queues_status_enum as enum ('Pending', 'Approved', 'Expired', 'Rejected');

create type oem.oem_notifications_notification_type_enum as enum ('Vendo Approved', 'Vendo Rejected', 'Vendo Submitted', 'Vendo Changed', 'Vendo Expired', 'Vendo Transacted', 'Quote Approved', 'Quote Rejected', 'Quote Submitted', 'Quote Changed', 'Quote Expired', 'Quote Transacted', 'Custom Alert', 'Batched User Email', 'User Verify', 'User Invite', 'Forgot Password');

create type oem.oem_quotes_users_type_enum as enum ('End Customer', 'Partner Sales', 'Distributor Sales', 'Distributor Contact', 'Partner Contact', 'Technical Contact', 'Internal', 'Other');

create type oem.oem_licensing_programs_licensing_program_type_enum as enum ('Customer', 'Partner', 'Distributor');

create type oem.oem_quotes_quote_status_enum as enum ('Draft', 'Pending', 'Auto-Approved', 'Approved', 'Rejected', 'Expired', 'Transacted');

create type oem.oem_quotes_deal_type_enum as enum ('Channel', 'Direct');

create type oem.oem_pricing_models_model_type_enum as enum ('Consumption', 'Subscription', 'One Time / Non-Recurring');

create type oem.oem_pricing_models_pricing_type_enum as enum ('Flat', 'Volume', 'Tiered');

create type oem.oem_pricing_models_unit_duration_enum as enum ('Consumed', 'Consumed Per Calendar Year', 'Consumed Per Calendar Month', 'Consumed Per Day', 'Consumed Per Week', 'Consumed Per 30 Days', 'Consumed Per 31 Days', 'Consumed Per 365 Days', 'One-Time / Non-Recurring', 'Per Calendar Year', 'Per Calendar Month', 'Per Seconds', 'Per Hour', 'Per Day', 'Per Week', 'Per 30 Days', 'Per 31 Days', 'Per 365 Days');

create type oem.oem_companies_permit_credit_cards_enum as enum ('All Products', 'Designated Products Only', 'No');

create type oem.oem_visible_product_fields_list_name_enum as enum ('Gross Margin (%)', 'Gross Margin ($)', 'Relative Uplift - Customer Price (%)', 'Relative Uplift - Customer Price ($)', 'Relative Uplift - Net Price (%)', 'Relative Uplift - Net Price ($)');

create type oem.oem_roles_role_type_enum as enum ('Quote Creator', 'Workflow Approver', 'Channel Manager', 'Admin');

create type oem.oem_roles_function_type_enum as enum ('Admin', 'Channel', 'Sales');

create type oem.oem_roles_data_access_enum as enum ('All', 'Team & Sub-Hierarchy', 'Team Only', 'Assigned Only');

create type oem.oem_roles_create_access_enum as enum ('All', 'Create', 'Edit & Approve Only', 'View Only');

create type oem.oem_discounts_discount_type_enum as enum ('Discretionary', 'Program');

create type oem.oem_discounts_applicable_to_enum as enum ('Customer', 'Channel');

create type oem.oem_discounts_position_enum as enum ('List Price', 'List Price After the following discounts', 'Customer Price', 'Customer Price After the following discounts');

create type oem.oem_discount_rules_discount_rule_type_enum as enum ('Customer', 'Channel', 'Promotions');

create type oem.oem_products_relationships_relationship_type_enum as enum ('Transition', 'Add On');

create type oem.oem_products_relationships_eligible_type_enum as enum ('Addon', 'Upgrade', 'Downgrade', 'Expand');

create type oem.oem_products_relationships_list_price_type_enum as enum ('Full List Price', 'Incremental');

create type oem.oem_quotes_products_payment_term_enum as enum ('10 Net 10 Days', '15 Net 15 Days', '30 Net 60 Days');

create type oem.oem_products_term_type_enum as enum ('days', 'weeks', 'months', 'years');

create type oem.oem_products_billing_frequency_enum as enum ('Upfront', 'Weekly', 'Bi-weekly', 'Monthly (Calendar)', 'Quarterly', 'Semi-Annually', 'Annually (Calendar)', 'Consumption-Based', 'Other / Custom', 'Every 30 Days', 'Every 31 Days', 'Every 90 Days', 'Every 365 Days');

create type oem.oem_products_product_availability_enum as enum ('Current Product', 'Add-On / Upgrade / Downgrade Only', 'Retired Product', 'Hidden');

create table if not exists oem.oem_contacts
(
    contact_id    serial,
    company_name  varchar(64)                                                                 not null,
    job_title     varchar(128)                                                                not null,
    last_name     varchar(32)                                                                 not null,
    first_name    varchar(32)                                                                 not null,
    contact_email varchar(128)                                                                not null,
    phone         varchar(36),
    is_enabled    boolean                  default true                                       not null,
    created_at    timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at    timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_d94344666d6566568ed339a3382"
        primary key (contact_id)
);

create unique index if not exists oem_contacts_pkey
    on oem.oem_contacts (contact_id);

create table if not exists oem.oem_materials
(
    material_id      serial,
    material_name    varchar(128)                                                                not null,
    file_url         varchar(256)                                                                not null,
    is_required      boolean                                                                     not null,
    package_position oem.oem_materials_package_position_enum                                     not null,
    is_enabled       boolean                  default true                                       not null,
    created_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    applicable_to    oem.oem_materials_applicable_to_enum                                        not null,
    constraint "PK_86eec6edc46560bcd36123c4943"
        primary key (material_id)
);

create unique index if not exists oem_materials_pkey
    on oem.oem_materials (material_id);

create table if not exists oem.oem_companies
(
    company_id               serial,
    company_name             varchar(128)                                                                                                                    not null,
    company_email            varchar(128)                                                                                                                    not null,
    logo_url                 varchar(256),
    default_quote_expiration numeric(4),
    bank_name                varchar(256),
    bank_account_number      varchar(36),
    bank_routing_number      varchar(36),
    phone                    varchar(36)                                                                                                                     not null,
    deal_attributes          character varying[]                                                                                                             not null,
    settings                 jsonb                    default '{"customListPriceName": "List Price", "customCustomerPriceName": "Price To Customer"}'::jsonb not null,
    permit_credit_cards      oem.oem_companies_permit_credit_cards_enum                                                                                      not null,
    is_permit_signing        boolean                                                                                                                         not null,
    is_enabled               boolean                  default true                                                                                           not null,
    created_at               timestamp with time zone default ('now'::text)::timestamp(6) with time zone                                                     not null,
    updated_at               timestamp with time zone default ('now'::text)::timestamp(6) with time zone                                                     not null,
    constraint "PK_06000b7392bb8cfeb15e599eef6"
        primary key (company_id),
    constraint "UQ_0f2b94daff9862e98d38f4628a4"
        unique (company_name),
    constraint "UQ_51bef76acda8cd168227e0cd60b"
        unique (company_email)
);

create table if not exists oem.oem_hierarchy_levels
(
    hierarchy_level_id serial,
    company_id         integer                                                                     not null,
    level_name         varchar(128)                                                                not null,
    hierarchy_type     oem.oem_hierarchy_levels_hierarchy_type_enum                                not null,
    level              numeric(3)                                                                  not null,
    is_active          boolean                  default true                                       not null,
    is_enabled         boolean                  default true                                       not null,
    created_at         timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at         timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_5d3d0d019407bd0225fa63bae99"
        primary key (hierarchy_level_id),
    constraint "UQ_b696fdcf589397223d912a07a92"
        unique (level_name),
    constraint "FK_d44357927326764ec69336fa2cd"
        foreign key (company_id) references oem.oem_companies
);

create unique index if not exists oem_product_hierarchy_levels_level_name_level_key
    on oem.oem_hierarchy_levels (level, level_name);

create unique index if not exists oem_product_hierarchy_levels_pkey
    on oem.oem_hierarchy_levels (hierarchy_level_id);

create index if not exists oem_product_hierarchy_levels_company_id_idx
    on oem.oem_hierarchy_levels (company_id);

create table if not exists oem.oem_hierarchies
(
    hierarchy_id        serial,
    hierarchy_level_id  integer                                                                     not null,
    company_id          integer                                                                     not null,
    parent_id           integer,
    hierarchy_name      varchar(128)                                                                not null,
    is_enabled          boolean                  default true                                       not null,
    is_active           boolean                  default true                                       not null,
    created_at          timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at          timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    mpath               varchar                  default ''::character varying,
    "parentHierarchyId" integer,
    constraint "PK_feb59bb1d7b29f410d3670eb2dc"
        primary key (hierarchy_id),
    constraint "FK_1629c814fc24d7c3b85b8f364a6"
        foreign key (company_id) references oem.oem_companies,
    constraint "FK_18ad5689eae9e0fc1bd161a2281"
        foreign key (hierarchy_level_id) references oem.oem_hierarchy_levels,
    constraint "FK_45f2205302db33e7e0f2569c170"
        foreign key ("parentHierarchyId") references oem.oem_hierarchies
            on delete cascade
);

create index if not exists oem_hierarchies_hierarchy_level_id_idx
    on oem.oem_hierarchies (hierarchy_level_id);

create unique index if not exists oem_hierarchies_pkey
    on oem.oem_hierarchies (hierarchy_id);

create index if not exists oem_hierarchies_company_id_idx
    on oem.oem_hierarchies (company_id);

create table if not exists oem.oem_licensing_programs
(
    licensing_program_id   serial,
    licensing_program_type oem.oem_licensing_programs_licensing_program_type_enum                      not null,
    licensing_program_name varchar(32)                                                                 not null,
    company_id             integer                                                                     not null,
    discount               real                                                                        not null,
    is_enabled             boolean                  default true                                       not null,
    created_at             timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at             timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_41123a48a0774cd2ec2b25edc90"
        primary key (licensing_program_id),
    constraint "FK_997f11267d8885b0f826e393642"
        foreign key (company_id) references oem.oem_companies
);

create unique index if not exists oem_licensing_programs_pkey
    on oem.oem_licensing_programs (licensing_program_id);

create index if not exists oem_licensing_programs_company_id_idx
    on oem.oem_licensing_programs (company_id);

create table if not exists oem.oem_deal_partners
(
    deal_partner_id                  serial,
    distributor_licensing_program_id integer                                                                     not null,
    reseller_licensing_program_id    integer                                                                     not null,
    distributor_name                 varchar(128)                                                                not null,
    reseller_name                    varchar(128)                                                                not null,
    is_enabled                       boolean                  default true                                       not null,
    created_at                       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at                       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_4f5efaa7acfdd588c6dbb20aaa6"
        primary key (deal_partner_id),
    constraint "FK_d4255fa71d57c25ab40f68cf602"
        foreign key (distributor_licensing_program_id) references oem.oem_licensing_programs
            on delete restrict,
    constraint "FK_270d6ca78f6b564f07cbefb60bf"
        foreign key (reseller_licensing_program_id) references oem.oem_licensing_programs
            on delete restrict
);

create index if not exists oem_deal_partners_reseller_licensing_program_id_idx
    on oem.oem_deal_partners (reseller_licensing_program_id);

create index if not exists oem_deal_partners_distributor_licensing_program_id_idx
    on oem.oem_deal_partners (distributor_licensing_program_id);

create unique index if not exists oem_deal_partners_pkey
    on oem.oem_deal_partners (deal_partner_id);

create table if not exists oem.oem_pricing_models
(
    pricing_model_id serial,
    company_id       integer                                                                     not null,
    model_name       varchar(128)                                                                not null,
    model_type       oem.oem_pricing_models_model_type_enum                                      not null,
    pricing_type     oem.oem_pricing_models_pricing_type_enum                                    not null,
    unit_metric      varchar(128)                                                                not null,
    unit_duration    oem.oem_pricing_models_unit_duration_enum                                   not null,
    tiers_enabled    boolean                                                                     not null,
    is_enabled       boolean                  default true                                       not null,
    created_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_f023606f105ea49e414cbf79376"
        primary key (pricing_model_id),
    constraint "FK_e87a13cefe49077059dc9eba56a"
        foreign key (company_id) references oem.oem_companies
);

create table if not exists oem.oem_unit_tiers
(
    unit_tier_id     serial,
    pricing_model_id integer                                                                     not null,
    unit_tier_name   varchar(128)                                                                not null,
    start_range      numeric                  default '0'::numeric                               not null,
    end_range        numeric,
    is_enabled       boolean                  default true                                       not null,
    created_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_329eb7f1ba9854f7f3588e41c66"
        primary key (unit_tier_id),
    constraint "FK_07dd5e880d294c3ec5175693aba"
        foreign key (pricing_model_id) references oem.oem_pricing_models
            on delete cascade
);

create index if not exists oem_unit_tiers_pricing_model_id_idx
    on oem.oem_unit_tiers (pricing_model_id);

create unique index if not exists oem_unit_tiers_pkey
    on oem.oem_unit_tiers (unit_tier_id);

create unique index if not exists oem_pricing_models_pkey
    on oem.oem_pricing_models (pricing_model_id);

create index if not exists oem_pricing_models_company_id_idx
    on oem.oem_pricing_models (company_id);

create unique index if not exists oem_companies_pkey
    on oem.oem_companies (company_id);

create unique index if not exists oem_companies_company_name_company_email_key
    on oem.oem_companies (company_email, company_name);

create table if not exists oem.oem_visible_product_fields
(
    visible_product_field_id serial,
    company_id               integer                                                                     not null,
    custom_name              varchar(128),
    list_name                oem.oem_visible_product_fields_list_name_enum                               not null,
    is_enabled               boolean                  default true                                       not null,
    created_at               timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at               timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_ea99c22843b070f89e4d845d2eb"
        primary key (visible_product_field_id)
);

create index if not exists oem_visible_product_field_company_id_idx
    on oem.oem_visible_product_fields (company_id);

create unique index if not exists oem_visible_product_field_pkey
    on oem.oem_visible_product_fields (visible_product_field_id);

create table if not exists oem.oem_roles
(
    role_id         serial,
    company_id      integer                                                                     not null,
    role_name       varchar(128)                                                                not null,
    priority        numeric(3)                                                                  not null,
    role_type       oem.oem_roles_role_type_enum                                                not null,
    function_type   oem.oem_roles_function_type_enum,
    data_access     oem.oem_roles_data_access_enum                                              not null,
    create_access   oem.oem_roles_create_access_enum                                            not null,
    is_active       boolean                                                                     not null,
    is_export_right boolean                                                                     not null,
    is_enabled      boolean                  default true                                       not null,
    created_at      timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at      timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_cc21c57114127335480b329c7ee"
        primary key (role_id),
    constraint "UQ_5d20494ee7c8fea5d28699c1ea0"
        unique (role_name),
    constraint "FK_a067e45b1d138a2d2804536952d"
        foreign key (company_id) references oem.oem_companies
);

create table if not exists oem.oem_approval_queue_priorities
(
    approval_queue_priority_id serial,
    company_id                 integer                                                                     not null,
    role_id                    integer                                                                     not null,
    priority                   serial,
    is_active                  boolean                  default true                                       not null,
    is_enabled                 boolean                  default true                                       not null,
    created_at                 timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at                 timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_16ab1dcf8ba519d3268bf035087"
        primary key (approval_queue_priority_id),
    constraint "REL_9a3998f90ec3edd10fcc11fb67"
        unique (role_id),
    constraint "FK_ca8d1018341aeb51998565a81c4"
        foreign key (company_id) references oem.oem_companies
            on delete cascade,
    constraint "FK_9a3998f90ec3edd10fcc11fb671"
        foreign key (role_id) references oem.oem_roles
            on delete cascade
);

create index if not exists oem_approval_queue_priorities_priority_idx
    on oem.oem_approval_queue_priorities (priority);

create index if not exists oem_approval_queue_priorities_role_id_idx
    on oem.oem_approval_queue_priorities (role_id);

create index if not exists oem_approval_queue_priorities_company_id_idx
    on oem.oem_approval_queue_priorities (company_id);

create unique index if not exists oem_approval_queue_priorities_pkey
    on oem.oem_approval_queue_priorities (approval_queue_priority_id);

create table if not exists oem.oem_roles_visible_product_fields
(
    role_id                  integer                                                                     not null,
    visible_product_field_id integer                                                                     not null,
    created_at               timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at               timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    is_enabled               boolean                  default true                                       not null,
    constraint "PK_49376bbdd2183b28f458cac02e4"
        primary key (role_id, visible_product_field_id),
    constraint "FK_1a553617822a3c5b98bac66f6db"
        foreign key (role_id) references oem.oem_roles
            on delete cascade,
    constraint "FK_60375d2ecf1c6dac99c1e771cc3"
        foreign key (visible_product_field_id) references oem.oem_visible_product_fields
            on delete cascade
);

create index if not exists oem_roles_visible_product_fields_visible_product_id_idx
    on oem.oem_roles_visible_product_fields (visible_product_field_id);

create index if not exists oem_roles_visible_product_fields_role_id_idx
    on oem.oem_roles_visible_product_fields (role_id);

create unique index if not exists oem_roles_pkey
    on oem.oem_roles (role_id);

create unique index if not exists oem_roles_role_name_idx
    on oem.oem_roles (role_name);

create index if not exists oem_roles_company_id_idx
    on oem.oem_roles (company_id);

create table if not exists oem.oem_discounts
(
    discount_id   serial,
    company_id    integer                                                                     not null,
    name          varchar(128),
    priority      serial,
    discount_type oem.oem_discounts_discount_type_enum                                        not null,
    applicable_to oem.oem_discounts_applicable_to_enum                                        not null,
    position      oem.oem_discounts_position_enum                                             not null,
    is_enabled    boolean                  default true                                       not null,
    is_active     boolean                  default true                                       not null,
    created_at    timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at    timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_114a8ab444a36d66d8073dbcd9d"
        primary key (discount_id)
);

create table if not exists oem.oem_discount_priorities
(
    source_discount_id integer                                                                     not null,
    target_discount_id integer                                                                     not null,
    priority           numeric(3)                                                                  not null,
    created_at         timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at         timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    is_enabled         boolean                  default true                                       not null,
    constraint "PK_19e9748c6bcb104166a4a5369bb"
        primary key (source_discount_id, target_discount_id),
    constraint "FK_dedb3a40cd1b955e46ce7af7957"
        foreign key (source_discount_id) references oem.oem_discounts
            on delete cascade,
    constraint "FK_446d603d65a8fd378c53af1af7b"
        foreign key (target_discount_id) references oem.oem_discounts
            on delete cascade
);

create index if not exists oem_discounts_priorities_target_id_idx
    on oem.oem_discount_priorities (target_discount_id);

create index if not exists oem_discount_priorities_source_id_idx
    on oem.oem_discount_priorities (source_discount_id);

create index if not exists oem_discounts_company_id_idx
    on oem.oem_discounts (company_id);

create unique index if not exists oem_discounts_pkey
    on oem.oem_discounts (discount_id);

create table if not exists oem.oem_users
(
    user_id              serial,
    company_id           integer                                                                     not null,
    geo_hierarchy_id     integer                                                                     not null,
    role_id              integer                                                                     not null,
    organization_id      varchar(24),
    pre_populated_fields character varying[],
    image_url            varchar(256),
    first_name           varchar(128)                                                                not null,
    last_name            varchar(128)                                                                not null,
    notification_email   varchar(256),
    sso_login_email      varchar(256)                                                                not null,
    password_encrypted   varchar(256)                                                                not null,
    phone                varchar(36)                                                                 not null,
    is_external          boolean                                                                     not null,
    region               varchar(128)                                                                not null,
    time_zone_area       varchar(48)                                                                 not null,
    is_hide_welcome_text boolean                                                                     not null,
    is_active            boolean                                                                     not null,
    is_enabled           boolean                  default true                                       not null,
    created_at           timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at           timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_64d8aec380cdce76959fc5427bc"
        primary key (user_id),
    constraint "FK_cceae4eb7304f2d1c9d0711389d"
        foreign key (role_id) references oem.oem_roles,
    constraint "FK_95598311afd09290acc5dbaaf3a"
        foreign key (company_id) references oem.oem_companies,
    constraint "FK_72a14a0aa7801219872175ef623"
        foreign key (geo_hierarchy_id) references oem.oem_hierarchies
            on delete restrict
);

create table if not exists oem.oem_shading_rules
(
    shading_rule_id    serial,
    company_id         integer                                                                     not null,
    owner_user_id      integer                                                                     not null,
    priority           numeric(3)                                                                  not null,
    shading_rule_name  varchar(256)                                                                not null,
    shading_rule_logic jsonb                                                                       not null,
    is_active          boolean                  default true                                       not null,
    is_enabled         boolean                  default true                                       not null,
    created_at         timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at         timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_7ab826ed44ed97fbd25909bf1d3"
        primary key (shading_rule_id),
    constraint "FK_2145b22898d173eb4baa09a693f"
        foreign key (company_id) references oem.oem_companies
            on delete restrict,
    constraint "FK_08d46aa7f83e6f19cdb54afc718"
        foreign key (owner_user_id) references oem.oem_users
            on delete restrict
);

create unique index if not exists oem_shading_rules_pkey
    on oem.oem_shading_rules (shading_rule_id);

create index if not exists oem_shading_rules_priority_key
    on oem.oem_shading_rules (priority);

create index if not exists oem_shading_rules_owner_user_id_idx
    on oem.oem_shading_rules (owner_user_id);

create index if not exists oem_shading_rules_company_id_idx
    on oem.oem_shading_rules (company_id);

create table if not exists oem.oem_workflow_rules
(
    workflow_rule_id    serial,
    company_id          integer                                                                     not null,
    owner_user_id       integer                                                                     not null,
    workflow_rule_name  varchar(256)                                                                not null,
    workflow_rule_logic jsonb                                                                       not null,
    is_active           boolean                  default true                                       not null,
    is_catchall         boolean                  default false                                      not null,
    is_enabled          boolean                  default true                                       not null,
    created_at          timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at          timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_2143fde13c2fc4d1b19ff6e2580"
        primary key (workflow_rule_id),
    constraint "FK_9626685ffa8340165fe40c5b015"
        foreign key (company_id) references oem.oem_companies,
    constraint "FK_0e7bbb7345168d82f6a7dac8006"
        foreign key (owner_user_id) references oem.oem_users
            on delete restrict
);

create unique index if not exists oem_workflow_rules_pkey
    on oem.oem_workflow_rules (workflow_rule_id);

create index if not exists oem_workflow_rules_owner_user_id_idx
    on oem.oem_workflow_rules (owner_user_id);

create index if not exists oem_workflow_rules_company_id_idx
    on oem.oem_workflow_rules (company_id);

create table if not exists oem.oem_vacation_rules
(
    vacation_rule_id serial,
    company_id       integer                                                                     not null,
    name             varchar(256)                                                                not null,
    source_user_id   integer                                                                     not null,
    target_user_id   integer                                                                     not null,
    is_active        boolean                  default true                                       not null,
    is_enabled       boolean                  default true                                       not null,
    created_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_277062150543231bd2ef316ec07"
        primary key (vacation_rule_id),
    constraint "FK_7b3b942111796a60a0ac2124cfb"
        foreign key (company_id) references oem.oem_companies,
    constraint "FK_855d305869b66b85508dad93197"
        foreign key (source_user_id) references oem.oem_users
            on delete restrict,
    constraint "FK_99cdfb87425389101e17c036a11"
        foreign key (target_user_id) references oem.oem_users
            on delete restrict
);

create unique index if not exists oem_vacation_rules_pkey
    on oem.oem_vacation_rules (vacation_rule_id);

create index if not exists oem_vacation_rules_target_user_id_idx
    on oem.oem_vacation_rules (target_user_id);

create index if not exists oem_vacation_rules_source_user_id_idx
    on oem.oem_vacation_rules (source_user_id);

create index if not exists oem_vacation_rules_company_id_idx
    on oem.oem_vacation_rules (company_id);

create table if not exists oem.oem_discount_rules
(
    discount_rule_id    serial,
    company_id          integer                                                                     not null,
    owner_user_id       integer                                                                     not null,
    discount_rule_name  varchar(256)                                                                not null,
    discount_rule_logic jsonb                                                                       not null,
    discount_rule_type  oem.oem_discount_rules_discount_rule_type_enum                              not null,
    is_enabled          boolean                  default true                                       not null,
    is_active           boolean                  default true                                       not null,
    created_at          timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at          timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_4b9f4f1302eb2197451bc6660bc"
        primary key (discount_rule_id),
    constraint "FK_7ecc3a22bfdbd705757045c1c9f"
        foreign key (owner_user_id) references oem.oem_users
);

create table if not exists oem.oem_discounts_discounts_rules
(
    discount_id      integer                                                                     not null,
    discount_rule_id integer                                                                     not null,
    created_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at       timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    is_enabled       boolean                  default true                                       not null,
    constraint "PK_e0b3df129e39ef72f57979dea53"
        primary key (discount_id, discount_rule_id),
    constraint "FK_008fc2cce0470956ed56b29befd"
        foreign key (discount_rule_id) references oem.oem_discount_rules
            on delete cascade,
    constraint "FK_e698209dcefe1da745716568f1f"
        foreign key (discount_id) references oem.oem_discounts
            on delete cascade
);

create index if not exists oem_discounts_discount_rules_discount_id_idx
    on oem.oem_discounts_discounts_rules (discount_id);

create index if not exists oem_discounts_discount_rules_id_idx
    on oem.oem_discounts_discounts_rules (discount_rule_id);

create index if not exists oem_discount_rules_user_id_idx
    on oem.oem_discount_rules (owner_user_id);

create index if not exists oem_discount_rules_company_id_idx
    on oem.oem_discount_rules (company_id);

create unique index if not exists oem_discount_rules_pkey
    on oem.oem_discount_rules (discount_rule_id);

create unique index if not exists oem_users_pkey
    on oem.oem_users (user_id);

create index if not exists oem_users_role_id_idx
    on oem.oem_users (role_id);

create unique index if not exists oem_users_sso_login_email_phone_key
    on oem.oem_users (phone, sso_login_email);

create index if not exists oem_users_geo_hierarchy_id_idx
    on oem.oem_users (geo_hierarchy_id);

create index if not exists oem_users_company_id_idx
    on oem.oem_users (company_id);

create table if not exists oem.oem_products
(
    product_id                    serial,
    product_hierarchy_id          integer                                                                     not null,
    owner_user_id                 integer                                                                     not null,
    pricing_model_id              integer                                                                     not null,
    sku_number                    varchar(64)                                                                 not null,
    product_name                  varchar(128)                                                                not null,
    term                          integer                                                                     not null,
    term_type                     oem.oem_products_term_type_enum                                             not null,
    same_unit_price_for_all_tiers boolean                                                                     not null,
    billing_frequency             oem.oem_products_billing_frequency_enum                                     not null,
    product_availability          oem.oem_products_product_availability_enum                                  not null,
    is_expandable                 boolean                                                                     not null,
    is_upgradable                 boolean                                                                     not null,
    is_downgradable               boolean                                                                     not null,
    is_renewable                  boolean                                                                     not null,
    is_enabled                    boolean                  default true                                       not null,
    created_at                    timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at                    timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_14a6c5f29c38085b33d48a132a5"
        primary key (product_id),
    constraint "FK_32a980410f246f76ee050b7d386"
        foreign key (owner_user_id) references oem.oem_users,
    constraint "FK_7495ba95eea6beb331ac49aa738"
        foreign key (product_hierarchy_id) references oem.oem_hierarchies,
    constraint "FK_ad976b8b5d2898f834d4a102ee7"
        foreign key (pricing_model_id) references oem.oem_pricing_models
);

create table if not exists oem.oem_price_tiers
(
    price_tier_id serial,
    unit_tier_id  integer                                                                     not null,
    product_id    integer                                                                     not null,
    cogs_unit     real                     default '0'::real                                  not null,
    price_unit    real                     default '0'::real                                  not null,
    is_enabled    boolean                  default true                                       not null,
    created_at    timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at    timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_96b216ba75e5f8a8c36ae3ec87c"
        primary key (price_tier_id),
    constraint "FK_73fe6b7d68b2a2cdef5e61ffc1a"
        foreign key (product_id) references oem.oem_products
            on delete cascade,
    constraint "FK_fd758cefe4a16232078c8b7fd4d"
        foreign key (unit_tier_id) references oem.oem_unit_tiers
            on delete cascade
);

create unique index if not exists oem_price_tiers_pkey
    on oem.oem_price_tiers (price_tier_id);

create table if not exists oem.oem_products_relationships
(
    product_relationship_id serial,
    source_product_id       integer                                                                                                                            not null,
    target_product_id       integer                                                                                                                            not null,
    relationship_type       oem.oem_products_relationships_relationship_type_enum                                                                              not null,
    eligible_type           oem.oem_products_relationships_eligible_type_enum                                                                                  not null,
    list_price_type         oem.oem_products_relationships_list_price_type_enum default 'Full List Price'::oem.oem_products_relationships_list_price_type_enum not null,
    is_enabled              boolean                                             default true                                                                   not null,
    is_active               boolean                                             default true                                                                   not null,
    created_at              timestamp with time zone                            default ('now'::text)::timestamp(6) with time zone                             not null,
    updated_at              timestamp with time zone                            default ('now'::text)::timestamp(6) with time zone                             not null,
    constraint "PK_632af8e550ddfcb54c5376e888c"
        primary key (product_relationship_id),
    constraint "FK_857517710a8dcccd3ea8b8de2c0"
        foreign key (source_product_id) references oem.oem_products
            on delete cascade,
    constraint "FK_16b74cfab1bb7b01454364d9ba9"
        foreign key (target_product_id) references oem.oem_products
            on delete cascade
);

create index if not exists oem_products_relationships_target_product_id_idx
    on oem.oem_products_relationships (target_product_id);

create index if not exists oem_products_relationships_source_product_id_idx
    on oem.oem_products_relationships (source_product_id);

create unique index if not exists oem_products_relationships_pkey
    on oem.oem_products_relationships (product_relationship_id);

create table if not exists oem.oem_quotes_products
(
    quote_product_id      serial,
    product_id            integer                                                                     not null,
    quote_id              integer                                                                     not null,
    end_date              timestamp with time zone                                                    not null,
    start_date            timestamp with time zone                                                    not null,
    quantity              numeric                                                                     not null,
    customer_product_uuid varchar(36),
    locked_fields         jsonb                    default '[]'::jsonb                                not null,
    invoice_schedule      jsonb                    default '[]'::jsonb                                not null,
    payment_term          oem.oem_quotes_products_payment_term_enum                                   not null,
    is_locked             boolean                  default false                                      not null,
    is_enabled            boolean                  default true                                       not null,
    created_at            timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at            timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_4cda7fdaa6478ccc06abd6163c1"
        primary key (quote_product_id),
    constraint "UQ_61fb61f303e8f808b35bd2adfd0"
        unique (customer_product_uuid),
    constraint "FK_9e3bd44b2b0e5b11ce807c0eaf5"
        foreign key (product_id) references oem.oem_products
            on delete cascade
);

create unique index if not exists oem_quotes_products_pkey
    on oem.oem_quotes_products (quote_product_id);

create index if not exists oem_quotes_products_quote_id_idx
    on oem.oem_quotes_products (quote_id);

create index if not exists oem_quotes_products_product_id_idx
    on oem.oem_quotes_products (product_id);

create unique index if not exists oem_products_pkey
    on oem.oem_products (product_id);

create index if not exists oem_products_product_hierarchy_id_idx
    on oem.oem_products (product_hierarchy_id);

create index if not exists oem_products_owner_user_id_idx
    on oem.oem_products (owner_user_id);

create table if not exists oem.oem_addresses
(
    address_id  serial,
    address_1   varchar(256),
    address_2   varchar(256),
    address_3   varchar(256),
    city        varchar(128)                                                                not null,
    zip_code    varchar(24)                                                                 not null,
    region      varchar(128)                                                                not null,
    country     varchar(32)                                                                 not null,
    phone       varchar(36),
    email       varchar(36),
    is_billing  boolean                  default false                                      not null,
    is_shipping boolean                  default false                                      not null,
    is_enabled  boolean                  default true                                       not null,
    created_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_2dba100d6097bfb696959110e5d"
        primary key (address_id)
);

create table if not exists oem.oem_customers
(
    customer_id           serial,
    licensing_program_id  integer                                                                     not null,
    organization_id       varchar(36),
    sales_organization_id varchar(36),
    customer_name         varchar(128)                                                                not null,
    industry              varchar(128),
    customer_email        varchar(256),
    logo_url              varchar(512),
    phone                 varchar(36),
    address_id            integer                                                                     not null,
    is_enabled            boolean                  default true                                       not null,
    created_at            timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at            timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_63a05c826ae444e897c81f77071"
        primary key (customer_id, address_id),
    constraint "UQ_2789a0ce1cf0546ec39ff18e97c"
        unique (customer_email),
    constraint "FK_91ad5529f1752e874a3784dff89"
        foreign key (address_id) references oem.oem_addresses
            on delete restrict
);

create table if not exists oem.oem_vendos
(
    vendo_id         serial,
    company_id       integer                                                                             not null,
    owner_user_id    integer                                                                             not null,
    customer_id      integer                                                                             not null,
    geo_hierarchy_id integer,
    vendo_uuid       char(36)                                                                            not null,
    opportunity_id   varchar(36),
    is_external      boolean                                                                             not null,
    vendo_name       varchar(128),
    vendo_comments   text,
    vendo_status     oem.oem_vendos_vendo_status_enum default 'Draft'::oem.oem_vendos_vendo_status_enum,
    expires_at       timestamp with time zone                                                            not null,
    submitted_at     timestamp with time zone,
    is_enabled       boolean                          default true                                       not null,
    created_at       timestamp with time zone         default ('now'::text)::timestamp(6) with time zone not null,
    updated_at       timestamp with time zone         default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_e68bf1f86565879c676bd5a7c93"
        primary key (vendo_id),
    constraint "UQ_cb103a31c67f5e2706279d16583"
        unique (vendo_uuid),
    constraint "FK_1e5cf2d8d1c1fb0731361dbb60f"
        foreign key (company_id) references oem.oem_companies,
    constraint "FK_3bd6ea3d427a17dd4fec2dd4232"
        foreign key (owner_user_id) references oem.oem_users,
    constraint "FK_4b86f6d79958bb8a175a13c9bc3"
        foreign key (customer_id) references oem_customers (customer_id),
    constraint "FK_faa05c57141b4edc48ade6baf4c"
        foreign key (geo_hierarchy_id) references oem.oem_hierarchies
            on delete restrict
);

create table if not exists oem.oem_vendos_users
(
    vendo_id    integer                                                                     not null,
    user_id     integer                                                                     not null,
    is_owner    boolean                  default false                                      not null,
    is_approver boolean                  default false                                      not null,
    created_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    is_enabled  boolean                  default true                                       not null,
    constraint "PK_a61173ef024de57bfee51e3e0db"
        primary key (vendo_id, user_id),
    constraint "FK_e96abe3e8b728562bdc46e80bdd"
        foreign key (user_id) references oem.oem_users
            on delete cascade,
    constraint "FK_71b803391bdf80baf53641eaeab"
        foreign key (vendo_id) references oem.oem_vendos
            on delete cascade
);

create index if not exists oem_vendos_users_vendo_id_idx
    on oem.oem_vendos_users (vendo_id);

create index if not exists oem_vendos_users_user_id_idx
    on oem.oem_vendos_users (user_id);

create table if not exists oem.oem_vendos_contacts
(
    vendo_id   integer                                                                     not null,
    contact_id integer                                                                     not null,
    position   numeric(3)                                                                  not null,
    type       oem.oem_vendos_contacts_type_enum                                           not null,
    created_at timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    is_enabled boolean                  default true                                       not null,
    is_owner   boolean                  default false,
    constraint "PK_74de1c735a0748e0148f8640da4"
        primary key (vendo_id, contact_id),
    constraint "FK_8cd4356a210035859a8ac449b2e"
        foreign key (contact_id) references oem.oem_contacts
            on delete cascade,
    constraint "FK_db7985329fce3ee22011163c564"
        foreign key (vendo_id) references oem.oem_vendos
            on delete cascade
);

create index if not exists oem_vendos_contacts_vendo_id_idx
    on oem.oem_vendos_contacts (vendo_id);

create index if not exists oem_vendos_contacts_contact_id_idx
    on oem.oem_vendos_contacts (contact_id);

create table if not exists oem.oem_vendos_materials
(
    vendo_id    integer                                                                     not null,
    material_id integer                                                                     not null,
    position    numeric(3)                                                                  not null,
    created_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    is_enabled  boolean                  default true                                       not null,
    constraint "PK_c4fe6b16cd2e3d93bb63c3c55d5"
        primary key (vendo_id, material_id),
    constraint "FK_2dc9362ca3d7b121147862b97ad"
        foreign key (material_id) references oem.oem_materials
            on delete cascade,
    constraint "FK_4a5e8b8284e7255aa8dce59e9dd"
        foreign key (vendo_id) references oem.oem_vendos
            on delete cascade
);

create index if not exists oem_vendos_materials_vendo_id_idx
    on oem.oem_vendos_materials (vendo_id);

create index if not exists oem_vendos_materials_material_id_idx
    on oem.oem_vendos_materials (material_id);

create index if not exists oem_vendos_expires_at_idx
    on oem.oem_vendos (expires_at);

create unique index if not exists oem_vendos_vendo_uuid_key
    on oem.oem_vendos (vendo_uuid);

create unique index if not exists oem_vendos_pkey
    on oem.oem_vendos (vendo_id);

create index if not exists oem_vendos_geo_hierarchy_id_idx
    on oem.oem_vendos (geo_hierarchy_id);

create index if not exists oem_vendos_customer_id_idx
    on oem.oem_vendos (customer_id);

create index if not exists oem_vendos_owner_user_id_idx
    on oem.oem_vendos (owner_user_id);

create index if not exists oem_vendos_company_id_idx
    on oem.oem_vendos (company_id);

create table if not exists oem.oem_vendo_approval_queues
(
    vendo_approval_queue_id    serial,
    company_id                 integer                                                                                                not null,
    user_id                    integer                                                                                                not null,
    vendo_id                   integer                                                                                                not null,
    approval_queue_priority_id integer                                                                                                not null,
    token                      varchar(256),
    status                     oem.oem_vendo_approval_queues_status_enum default 'Pending'::oem.oem_vendo_approval_queues_status_enum not null,
    is_active                  boolean                                   default true                                                 not null,
    is_enabled                 boolean                                   default true                                                 not null,
    expires_at                 timestamp with time zone,
    created_at                 timestamp with time zone                  default ('now'::text)::timestamp(6) with time zone           not null,
    updated_at                 timestamp with time zone                  default ('now'::text)::timestamp(6) with time zone           not null,
    customer_id                integer,
    target_type                varchar(36),
    constraint "PK_e42c22cfd82d9de75ff546b1afd"
        primary key (vendo_approval_queue_id),
    constraint "FK_51048a498eb46f2bb44ad77d33a"
        foreign key (company_id) references oem.oem_companies
            on delete cascade,
    constraint "FK_e0bead345ec1bebeddcb2e755f9"
        foreign key (user_id) references oem.oem_users
            on delete cascade,
    constraint "FK_8e67124122ad55359a8a1bbb994"
        foreign key (vendo_id) references oem.oem_vendos
            on delete cascade,
    constraint "FK_24012a7c79fb537d142ce2edfba"
        foreign key (approval_queue_priority_id) references oem.oem_approval_queue_priorities
            on delete cascade
);

create index if not exists oem_vendo_approval_queues_priority_id_idx
    on oem.oem_vendo_approval_queues (approval_queue_priority_id);

create index if not exists oem_vendo_approval_queues_token_idx
    on oem.oem_vendo_approval_queues (token);

create index if not exists oem_vendo_approval_queues_vendo_id_idx
    on oem.oem_vendo_approval_queues (vendo_id);

create index if not exists oem_vendo_approval_queues_user_id_idx
    on oem.oem_vendo_approval_queues (user_id);

create index if not exists oem_vendo_approval_queues_company_id_idx
    on oem.oem_vendo_approval_queues (company_id);

create unique index if not exists oem_vendo_approval_queues_pkey
    on oem.oem_vendo_approval_queues (vendo_approval_queue_id);

create table if not exists oem.oem_quotes
(
    quote_id                     serial,
    owner_user_id                integer                                                                             not null,
    company_id                   integer                                                                             not null,
    customer_id                  integer                                                                             not null,
    geo_hierarchy_id             integer                                                                             not null,
    deal_partner_id              integer                                                                             not null,
    quote_uuid                   varchar(36)                                                                         not null,
    opportunity_id               varchar(36),
    quote_name                   varchar(128)                                                                        not null,
    net_amount                   numeric                          default '0'::numeric                               not null,
    quote_status                 oem.oem_quotes_quote_status_enum default 'Draft'::oem.oem_quotes_quote_status_enum  not null,
    deal_type                    oem.oem_quotes_deal_type_enum                                                       not null,
    currency                     char(3)                                                                             not null,
    quote_comments               text,
    quote_internal_comments      text,
    quote_internal_comment_files jsonb                            default '[]'::jsonb                                not null,
    quote_attributes             jsonb                            default '[]'::jsonb                                not null,
    expires_at                   timestamp with time zone                                                            not null,
    submitted_at                 timestamp with time zone,
    pdf_file_url                 varchar(256),
    excel_file_url               varchar(256),
    is_external                  boolean                                                                             not null,
    is_black_box                 boolean                                                                             not null,
    is_accepting_credit_card     boolean                                                                             not null,
    is_requiring_signing         boolean                                                                             not null,
    is_locked                    boolean                                                                             not null,
    is_distributor_visible       boolean                                                                             not null,
    is_reseller_visible          boolean                                                                             not null,
    is_external_hide_invoice     boolean                                                                             not null,
    is_external_hide_unit        boolean                                                                             not null,
    is_external_hide_contact     boolean                                                                             not null,
    is_enabled                   boolean                          default true                                       not null,
    created_at                   timestamp with time zone         default ('now'::text)::timestamp(6) with time zone not null,
    updated_at                   timestamp with time zone         default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_ceba72c3ff4adc06283ab38d293"
        primary key (quote_id),
    constraint "UQ_54880fb42ae75c726aad0455b0d"
        unique (quote_uuid),
    constraint "FK_0fe22bb3526f24501c6bbd50903"
        foreign key (company_id) references oem.oem_companies
            on delete restrict,
    constraint "FK_bb0a78a046ba1b4e6108f83e72e"
        foreign key (owner_user_id) references oem.oem_users
            on delete restrict,
    constraint "FK_c67dd4067709601b07b423648f1"
        foreign key (customer_id) references oem.oem_customers (customer_id)
            on delete restrict,
    constraint "FK_36f212b923905c0f743ba7bf65c"
        foreign key (deal_partner_id) references oem.oem_deal_partners
            on delete restrict,
    constraint "FK_71d80348643a059227d69c9c067"
        foreign key (geo_hierarchy_id) references oem.oem_hierarchies
            on delete restrict
);

create table if not exists oem.oem_vendos_quotes
(
    vendo_id   integer                                                                     not null,
    quote_id   integer                                                                     not null,
    created_at timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    is_enabled boolean                  default true                                       not null,
    constraint "PK_9d65868e58cc629c0c1eeba0975"
        primary key (vendo_id, quote_id),
    constraint "FK_cb19cb05732ef88b63b2fbdbf59"
        foreign key (quote_id) references oem.oem_quotes
            on delete cascade,
    constraint "FK_750b14c97bb826cffecd6d00aa1"
        foreign key (vendo_id) references oem.oem_vendos
            on delete cascade
);

create index if not exists oem_vendos_quotes_vendo_id_idx
    on oem.oem_vendos_quotes (vendo_id);

create index if not exists oem_vendos_quotes_quote_id_idx
    on oem.oem_vendos_quotes (quote_id);

create table if not exists oem.oem_quotes_contacts
(
    quote_id   integer                                                                     not null,
    contact_id integer                                                                     not null,
    position   numeric(3)                                                                  not null,
    type       oem.oem_quotes_contacts_type_enum                                           not null,
    created_at timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    is_enabled boolean                  default true                                       not null,
    is_owner   boolean                  default false                                      not null,
    constraint "PK_0a7d662317aa0b36c09beaab92c"
        primary key (quote_id, contact_id),
    constraint "FK_b97b91db4b0043480d6491af902"
        foreign key (contact_id) references oem.oem_contacts
            on delete cascade,
    constraint "FK_3d6acf1a82c7e2efcb7ff41474b"
        foreign key (quote_id) references oem.oem_quotes
            on delete cascade
);

create index if not exists oem_quotes_contacts_quote_id_idx
    on oem.oem_quotes_contacts (quote_id);

create index if not exists oem_quotes_contacts_contact_id_idx
    on oem.oem_quotes_contacts (contact_id);

create table if not exists oem.oem_quotes_materials
(
    quote_id    integer                                                                     not null,
    material_id integer                                                                     not null,
    position    numeric(3)                                                                  not null,
    is_enabled  boolean                  default true                                       not null,
    created_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_d3d368acb03965aa3b4fff196e3"
        primary key (quote_id, material_id),
    constraint "FK_0667e7fb0efc3a78d572b0cd1ee"
        foreign key (material_id) references oem.oem_materials
            on delete cascade,
    constraint "FK_eb2d51785cb401169f451280dcc"
        foreign key (quote_id) references oem.oem_quotes
            on delete cascade
);

create index if not exists oem_quotes_materials_quote_id_idx
    on oem.oem_quotes_materials (quote_id);

create index if not exists oem_quotes_materials_material_id_idx
    on oem.oem_quotes_materials (material_id);

create table if not exists oem.oem_users_viewed_vendos_quotes
(
    recently_viewed_id serial,
    user_id            integer                                                                     not null,
    vendo_id           integer,
    quote_id           integer,
    is_enabled         boolean                  default true                                       not null,
    created_at         timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at         timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_08ac1dc1997e4c4c51851352d2c"
        primary key (recently_viewed_id),
    constraint "FK_27cc9d75d3165cbaaf8431c88d9"
        foreign key (quote_id) references oem.oem_quotes
            on delete cascade,
    constraint "FK_cf4292f24e7f4488458e8215a5c"
        foreign key (vendo_id) references oem.oem_vendos
            on delete cascade
);

create index if not exists oem_users_viewed_vendos_quotes_quote_id_idx
    on oem.oem_users_viewed_vendos_quotes (quote_id);

create index if not exists oem_users_viewed_vendos_quotes_vendo_id_idx
    on oem.oem_users_viewed_vendos_quotes (vendo_id);

create index if not exists oem_users_viewed_vendos_quotes_user_id_idx
    on oem.oem_users_viewed_vendos_quotes (user_id);

create table if not exists oem.oem_quote_approval_queues
(
    quote_approval_queue_id    serial,
    company_id                 integer                                                                                                not null,
    user_id                    integer,
    quote_id                   integer                                                                                                not null,
    approval_queue_priority_id integer,
    token                      varchar(256),
    status                     oem.oem_quote_approval_queues_status_enum default 'Pending'::oem.oem_quote_approval_queues_status_enum not null,
    is_active                  boolean                                   default true                                                 not null,
    is_enabled                 boolean                                   default true                                                 not null,
    expires_at                 timestamp with time zone,
    created_at                 timestamp with time zone                  default ('now'::text)::timestamp(6) with time zone           not null,
    updated_at                 timestamp with time zone                  default ('now'::text)::timestamp(6) with time zone           not null,
    customer_id                integer,
    target_type                varchar(256),
    constraint "PK_e1bbf4fdcf5f3b00ab4d3d19fa0"
        primary key (quote_approval_queue_id),
    constraint "FK_0f31c77043511f53795baedbf3a"
        foreign key (company_id) references oem.oem_companies
            on delete cascade,
    constraint "FK_4887019cbc4931f7303bfe83ea3"
        foreign key (user_id) references oem.oem_users
            on delete cascade,
    constraint "FK_d846ac4ec28972672030910400b"
        foreign key (quote_id) references oem.oem_quotes
            on delete cascade,
    constraint "FK_90affcd193be1bbd8ccd950a6fa"
        foreign key (approval_queue_priority_id) references oem.oem_approval_queue_priorities
            on delete cascade
);

create index if not exists oem_quote_approval_queues_priority_id_idx
    on oem.oem_quote_approval_queues (approval_queue_priority_id);

create index if not exists oem_quote_approval_queues_token_idx
    on oem.oem_quote_approval_queues (token);

create index if not exists oem_quote_approval_queues_quote_id_idx
    on oem.oem_quote_approval_queues (quote_id);

create index if not exists oem_quote_approval_queues_user_id_idx
    on oem.oem_quote_approval_queues (user_id);

create index if not exists oem_quote_approval_queues_company_id_idx
    on oem.oem_quote_approval_queues (company_id);

create unique index if not exists oem_quote_approval_queues_pkey
    on oem.oem_quote_approval_queues (quote_approval_queue_id);

create table if not exists oem.oem_notifications
(
    notification_id         serial,
    company_id              integer                                                                     not null,
    sender_id               integer,
    receiver_id             integer,
    customer_id             integer,
    user_custom_alert_id    integer,
    company_alert_id        integer,
    quote_id                integer,
    vendo_id                integer,
    quote_approval_queue_id integer,
    vendo_approval_queue_id integer,
    from_email              varchar(256)                                                                not null,
    to_email                varchar(256)                                                                not null,
    notification_type       oem.oem_notifications_notification_type_enum                                not null,
    subject                 varchar(256)                                                                not null,
    sent_at                 timestamp with time zone,
    is_read                 boolean                  default false                                      not null,
    status                  varchar(256)             default 'requested'::character varying             not null,
    message_id              varchar(256),
    meta_data               jsonb                                                                       not null,
    req_body                jsonb[],
    is_enabled              boolean                  default true                                       not null,
    created_at              timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at              timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_968dba3a685dd6ed7f6bbcb5281"
        primary key (notification_id),
    constraint "FK_25c9e6831f309eb607f22422a27"
        foreign key (company_id) references oem.oem_companies
            on delete restrict,
    constraint "FK_a59f6d0ea03dbbe96028ac06e94"
        foreign key (sender_id) references oem.oem_users
            on delete restrict,
    constraint "FK_d7b7f853f94fd3381099c19f409"
        foreign key (receiver_id) references oem.oem_users
            on delete restrict,
    constraint "FK_b26f683b73d13ae2149eaebe8e0"
        foreign key (customer_id) references oem.oem_customers (customer_id)
            on delete restrict,
    constraint "FK_f67b356c107ab91362da0343d89"
        foreign key (quote_approval_queue_id) references oem.oem_quote_approval_queues
            on delete restrict,
    constraint "FK_8e1e6cd1278d6512486996eec5c"
        foreign key (vendo_approval_queue_id) references oem.oem_vendo_approval_queues
            on delete restrict,
    constraint "FK_fdf6a23362fc0ac8a4cf39acf13"
        foreign key (quote_id) references oem.oem_quotes
            on delete restrict,
    constraint "FK_785225b7685d0359564fb0347ae"
        foreign key (vendo_id) references oem.oem_vendos
            on delete restrict
);

create index if not exists oem_notifications_vendo_id_idx
    on oem.oem_notifications (vendo_id);

create index if not exists oem_notifications_quote_id_idx
    on oem.oem_notifications (quote_id);

create index if not exists oem_notifications_customer_id_idx
    on oem.oem_notifications (customer_id);

create index if not exists oem_notifications_receiver_id_idx
    on oem.oem_notifications (receiver_id);

create index if not exists oem_notifications_sender_id_idx
    on oem.oem_notifications (sender_id);

create index if not exists oem_notifications_company_id_idx
    on oem.oem_notifications (company_id);

create unique index if not exists oem_notifications_pkey
    on oem.oem_notifications (notification_id);

create table if not exists oem.oem_quotes_users
(
    quote_id    integer                                                                     not null,
    user_id     integer                                                                     not null,
    type        oem.oem_quotes_users_type_enum                                              not null,
    is_owner    boolean                  default false                                      not null,
    is_approver boolean                  default false                                      not null,
    is_enabled  boolean                  default true                                       not null,
    created_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at  timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_93956ff58158eb5e882f7f9d841"
        primary key (quote_id, user_id),
    constraint "FK_3771e9248755210a7e249ec154a"
        foreign key (quote_id) references oem.oem_quotes
            on delete cascade,
    constraint "FK_2fc887c4308717e638d2877d108"
        foreign key (user_id) references oem.oem_users
            on delete cascade
);

create index if not exists oem_quotes_users_user_id_idx
    on oem.oem_quotes_users (user_id);

create index if not exists oem_quotes_users_quote_id_idx
    on oem.oem_quotes_users (quote_id);

create index if not exists oem_quotes_expires_at_idx
    on oem.oem_quotes (expires_at);

create unique index if not exists oem_quotes_quote_uuid_key
    on oem.oem_quotes (quote_uuid);

create unique index if not exists oem_quotes_pkey
    on oem.oem_quotes (quote_id);

create index if not exists oem_quotes_geo_hierarchy_id_idx
    on oem.oem_quotes (geo_hierarchy_id);

create index if not exists oem_quotes_deal_partner_id_idx
    on oem.oem_quotes (deal_partner_id);

create index if not exists oem_quotes_customer_id_idx
    on oem.oem_quotes (customer_id);

create index if not exists oem_quotes_owner_user_id_idx
    on oem.oem_quotes (owner_user_id);

create index if not exists oem_quotes_company_id_idx
    on oem.oem_quotes (company_id);

create table if not exists oem.oem_customers_products
(
    customer_product_id serial,
    product_id          integer                                                                     not null,
    customer_id         integer                                                                     not null,
    quantity            numeric                                                                     not null,
    end_date            timestamp with time zone                                                    not null,
    "customerPrice"     numeric                  default '0'::numeric                               not null,
    "netPrice"          numeric                  default '0'::numeric                               not null,
    is_enabled          boolean                  default true                                       not null,
    created_at          timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at          timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_cdeffa41aa46805568d0a82645e"
        primary key (customer_product_id),
    constraint "FK_06c1d72d8e1cfe92c0e6cc40a41"
        foreign key (customer_id) references oem.oem_customers (customer_id)
            on delete cascade,
    constraint "FK_6c217f1c8bbfddb2f6b58bfd287"
        foreign key (product_id) references oem.oem_products
            on delete cascade
);

create table if not exists oem.oem_quotes_customer_products
(
    quote_customer_product_id serial,
    customer_product_id       integer                                                                     not null,
    quote_id                  integer                                                                     not null,
    customer_product_uuid     varchar(36),
    locked_fields             jsonb                    default '[]'::jsonb                                not null,
    is_locked                 boolean                                                                     not null,
    is_enabled                boolean                  default true                                       not null,
    created_at                timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    updated_at                timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_f0342486c6511bdf0b9af13729c"
        primary key (quote_customer_product_id),
    constraint "UQ_a1ba06e4a54a88e0c21fd0e3581"
        unique (customer_product_uuid),
    constraint "FK_70462f3cf9216b23a5eaa6f7ddf"
        foreign key (customer_product_id) references oem.oem_customers_products
            on delete cascade
);

create unique index if not exists oem_quotes_customer_products_pkey
    on oem.oem_quotes_customer_products (quote_customer_product_id);

create index if not exists oem_quotes_customer_products_quote_id_idx
    on oem.oem_quotes_customer_products (quote_id);

create index if not exists oem_quotes_customer_products_customer_product_id_idx
    on oem.oem_quotes_customer_products (customer_product_id);

create unique index if not exists oem_customers_products_pkey
    on oem.oem_customers_products (customer_product_id);

create index if not exists oem_customers_products_product_id_idx
    on oem.oem_customers_products (product_id);

create index if not exists oem_customers_products_customer_id_idx
    on oem.oem_customers_products (customer_id);

create index if not exists oem_customers_licensing_program_id_idx
    on oem.oem_customers (licensing_program_id);

create unique index if not exists oem_customers_pkey
    on oem.oem_customers (customer_id);

create unique index if not exists oem_customers_customer_email_key
    on oem.oem_customers (customer_email);

create index if not exists oem_customers_address_id_idx
    on oem.oem_customers (address_id);

create unique index if not exists oem_addresses_pkey
    on oem.oem_addresses (address_id);

create table if not exists oem.oem_company_addresses
(
    company_id integer                                                                     not null,
    address_id integer                                                                     not null,
    created_at timestamp with time zone default ('now'::text)::timestamp(6) with time zone not null,
    constraint "PK_4a29167ab704c842f4086c939e4"
        primary key (company_id, address_id),
    constraint "FK_41a0c720b358667026f5eada0e3"
        foreign key (address_id) references oem.oem_addresses
            on delete cascade,
    constraint "FK_cfe0bcdbd1fa9de9f2f7a08fe95"
        foreign key (company_id) references oem.oem_companies
            on delete cascade
);

create index if not exists oem_company_addresses_company_id_idx
    on oem.oem_company_addresses (company_id);

create index if not exists oem_company_addresses_address_id_idx
    on oem.oem_company_addresses (address_id);


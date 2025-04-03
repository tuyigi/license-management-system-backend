--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Debian 15.12-1.pgdg120+1)
-- Dumped by pg_dump version 15.12 (Ubuntu 15.12-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: certificate_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificate_reports (
    id integer NOT NULL,
    issue_date timestamp without time zone NOT NULL,
    expiry_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    certificate integer,
    responsible integer
);


ALTER TABLE public.certificate_reports OWNER TO postgres;

--
-- Name: certificate_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificate_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.certificate_reports_id_seq OWNER TO postgres;

--
-- Name: certificate_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificate_reports_id_seq OWNED BY public.certificate_reports.id;


--
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id integer NOT NULL,
    certificate character varying NOT NULL,
    description character varying,
    user_organization character varying,
    issue_date timestamp without time zone,
    expiry_date timestamp without time zone,
    certificate_type character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    department integer
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.certificates_id_seq OWNER TO postgres;

--
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- Name: components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.components (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    start_date timestamp without time zone NOT NULL,
    expiry_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    contract integer
);


ALTER TABLE public.components OWNER TO postgres;

--
-- Name: components_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.components_id_seq OWNER TO postgres;

--
-- Name: components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.components_id_seq OWNED BY public.components.id;


--
-- Name: contract_reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contract_reminders (
    id integer NOT NULL,
    reminder_date timestamp without time zone NOT NULL,
    description character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    contract integer,
    "user" integer
);


ALTER TABLE public.contract_reminders OWNER TO postgres;

--
-- Name: contract_reminders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contract_reminders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contract_reminders_id_seq OWNER TO postgres;

--
-- Name: contract_reminders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contract_reminders_id_seq OWNED BY public.contract_reminders.id;


--
-- Name: contract_system_tools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contract_system_tools (
    id integer NOT NULL,
    price integer DEFAULT 0 NOT NULL,
    currency character varying,
    issue_date timestamp without time zone,
    expire_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "systemToolId" integer,
    "contractId" integer
);


ALTER TABLE public.contract_system_tools OWNER TO postgres;

--
-- Name: contract_system_tools_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contract_system_tools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contract_system_tools_id_seq OWNER TO postgres;

--
-- Name: contract_system_tools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contract_system_tools_id_seq OWNED BY public.contract_system_tools.id;


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id integer NOT NULL,
    contract_number character varying NOT NULL,
    payment_frequency character varying DEFAULT 'YEAR'::character varying NOT NULL,
    annual_license_fees double precision NOT NULL,
    currency character varying DEFAULT 'USD'::character varying NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    description text,
    contract_status character varying DEFAULT 'VALID'::character varying NOT NULL,
    document_link character varying,
    number_system_users integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    approval_status character varying DEFAULT 'PENDING'::character varying NOT NULL,
    approval_comment character varying,
    vendor integer,
    system_tool integer,
    department integer
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contracts_id_seq OWNER TO postgres;

--
-- Name: contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contracts_id_seq OWNED BY public.contracts.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.departments_id_seq OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: functions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.functions (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.functions OWNER TO postgres;

--
-- Name: functions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.functions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.functions_id_seq OWNER TO postgres;

--
-- Name: functions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.functions_id_seq OWNED BY public.functions.id;


--
-- Name: license_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.license_requests (
    id integer NOT NULL,
    request_type character varying NOT NULL,
    description character varying NOT NULL,
    reason character varying,
    license_period character varying NOT NULL,
    license_period_count integer NOT NULL,
    request_status character varying DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    license_id integer,
    organization_id integer,
    requested_by integer
);


ALTER TABLE public.license_requests OWNER TO postgres;

--
-- Name: license_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.license_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.license_requests_id_seq OWNER TO postgres;

--
-- Name: license_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.license_requests_id_seq OWNED BY public.license_requests.id;


--
-- Name: licenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.licenses (
    id integer NOT NULL,
    name character varying NOT NULL,
    code character varying NOT NULL,
    description character varying NOT NULL,
    license_category character varying DEFAULT 'INSTITUTION_LICENSE'::character varying NOT NULL,
    status character varying DEFAULT 'ENABLED'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    vendor_id integer
);


ALTER TABLE public.licenses OWNER TO postgres;

--
-- Name: licenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.licenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.licenses_id_seq OWNER TO postgres;

--
-- Name: licenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.licenses_id_seq OWNED BY public.licenses.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id integer NOT NULL,
    message character varying NOT NULL,
    status character varying NOT NULL,
    notification_type character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "organizationIdId" integer
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_id_seq OWNER TO postgres;

--
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- Name: organization_licenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization_licenses (
    id integer NOT NULL,
    description character varying,
    license_period character varying NOT NULL,
    license_period_count integer NOT NULL,
    license_reference_number character varying,
    status character varying DEFAULT 'ENABLED'::character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    organization_id integer,
    license_id integer,
    requested_by integer,
    approved_by integer,
    license_request integer
);


ALTER TABLE public.organization_licenses OWNER TO postgres;

--
-- Name: organization_licenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organization_licenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organization_licenses_id_seq OWNER TO postgres;

--
-- Name: organization_licenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organization_licenses_id_seq OWNED BY public.organization_licenses.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id integer NOT NULL,
    name character varying NOT NULL,
    tin character varying NOT NULL,
    province character varying NOT NULL,
    representative_name character varying NOT NULL,
    representative_phone_number character varying NOT NULL,
    organization_type character varying NOT NULL,
    status character varying DEFAULT 'ENABLED'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organizations_id_seq OWNER TO postgres;

--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    start_period timestamp without time zone NOT NULL,
    end_period timestamp without time zone NOT NULL,
    payment_fee double precision NOT NULL,
    payment_status character varying DEFAULT 'PENDING'::character varying NOT NULL,
    order_number integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    contract integer
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: privileges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.privileges (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    status character varying DEFAULT 'ENABLED'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.privileges OWNER TO postgres;

--
-- Name: privileges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.privileges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.privileges_id_seq OWNER TO postgres;

--
-- Name: privileges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.privileges_id_seq OWNED BY public.privileges.id;


--
-- Name: report_licenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_licenses (
    id integer NOT NULL,
    description character varying NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    payment_reference character varying NOT NULL,
    period_cost double precision NOT NULL,
    doc_reference_link character varying,
    payment_status character varying DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    payment_period integer,
    created_by integer
);


ALTER TABLE public.report_licenses OWNER TO postgres;

--
-- Name: report_licenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_licenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.report_licenses_id_seq OWNER TO postgres;

--
-- Name: report_licenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_licenses_id_seq OWNED BY public.report_licenses.id;


--
-- Name: request_audit_trails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_audit_trails (
    id integer NOT NULL,
    action_type character varying DEFAULT 'REVIEWED'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer,
    request_id integer
);


ALTER TABLE public.request_audit_trails OWNER TO postgres;

--
-- Name: request_audit_trails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_audit_trails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_audit_trails_id_seq OWNER TO postgres;

--
-- Name: request_audit_trails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_audit_trails_id_seq OWNED BY public.request_audit_trails.id;


--
-- Name: role_privileges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_privileges (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    role_id integer,
    privilege_id integer
);


ALTER TABLE public.role_privileges OWNER TO postgres;

--
-- Name: role_privileges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_privileges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_privileges_id_seq OWNER TO postgres;

--
-- Name: role_privileges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_privileges_id_seq OWNED BY public.role_privileges.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    status character varying DEFAULT 'ENABLED'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: system_functions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_functions (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    system_tool integer,
    system_function integer
);


ALTER TABLE public.system_functions OWNER TO postgres;

--
-- Name: system_functions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_functions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.system_functions_id_seq OWNER TO postgres;

--
-- Name: system_functions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_functions_id_seq OWNED BY public.system_functions.id;


--
-- Name: system_tools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_tools (
    id integer NOT NULL,
    system_tool_name character varying NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    department integer
);


ALTER TABLE public.system_tools OWNER TO postgres;

--
-- Name: system_tools_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_tools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.system_tools_id_seq OWNER TO postgres;

--
-- Name: system_tools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_tools_id_seq OWNED BY public.system_tools.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying,
    last_name character varying,
    username character varying,
    email character varying NOT NULL,
    status character varying DEFAULT 'ENABLED'::character varying NOT NULL,
    user_type character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    role_id integer,
    organization_id integer,
    department integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    vendor_name character varying NOT NULL,
    vendor_website character varying NOT NULL,
    description character varying NOT NULL,
    status character varying DEFAULT 'ENABLED'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vendors_id_seq OWNER TO postgres;

--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: certificate_reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_reports ALTER COLUMN id SET DEFAULT nextval('public.certificate_reports_id_seq'::regclass);


--
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- Name: components id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components ALTER COLUMN id SET DEFAULT nextval('public.components_id_seq'::regclass);


--
-- Name: contract_reminders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_reminders ALTER COLUMN id SET DEFAULT nextval('public.contract_reminders_id_seq'::regclass);


--
-- Name: contract_system_tools id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_system_tools ALTER COLUMN id SET DEFAULT nextval('public.contract_system_tools_id_seq'::regclass);


--
-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts ALTER COLUMN id SET DEFAULT nextval('public.contracts_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: functions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.functions ALTER COLUMN id SET DEFAULT nextval('public.functions_id_seq'::regclass);


--
-- Name: license_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.license_requests ALTER COLUMN id SET DEFAULT nextval('public.license_requests_id_seq'::regclass);


--
-- Name: licenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.licenses ALTER COLUMN id SET DEFAULT nextval('public.licenses_id_seq'::regclass);


--
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- Name: organization_licenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_licenses ALTER COLUMN id SET DEFAULT nextval('public.organization_licenses_id_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: privileges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privileges ALTER COLUMN id SET DEFAULT nextval('public.privileges_id_seq'::regclass);


--
-- Name: report_licenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_licenses ALTER COLUMN id SET DEFAULT nextval('public.report_licenses_id_seq'::regclass);


--
-- Name: request_audit_trails id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_audit_trails ALTER COLUMN id SET DEFAULT nextval('public.request_audit_trails_id_seq'::regclass);


--
-- Name: role_privileges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_privileges ALTER COLUMN id SET DEFAULT nextval('public.role_privileges_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: system_functions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_functions ALTER COLUMN id SET DEFAULT nextval('public.system_functions_id_seq'::regclass);


--
-- Name: system_tools id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_tools ALTER COLUMN id SET DEFAULT nextval('public.system_tools_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Data for Name: certificate_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificate_reports (id, issue_date, expiry_date, created_at, updated_at, certificate, responsible) FROM stdin;
\.


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, certificate, description, user_organization, issue_date, expiry_date, certificate_type, created_at, updated_at, department) FROM stdin;
\.


--
-- Data for Name: components; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.components (id, name, description, start_date, expiry_date, created_at, updated_at, contract) FROM stdin;
\.


--
-- Data for Name: contract_reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contract_reminders (id, reminder_date, description, created_at, updated_at, contract, "user") FROM stdin;
\.


--
-- Data for Name: contract_system_tools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contract_system_tools (id, price, currency, issue_date, expire_date, created_at, updated_at, "systemToolId", "contractId") FROM stdin;
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, contract_number, payment_frequency, annual_license_fees, currency, start_date, end_date, description, contract_status, document_link, number_system_users, created_at, updated_at, approval_status, approval_comment, vendor, system_tool, department) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: functions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.functions (id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: license_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.license_requests (id, request_type, description, reason, license_period, license_period_count, request_status, created_at, updated_at, license_id, organization_id, requested_by) FROM stdin;
\.


--
-- Data for Name: licenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.licenses (id, name, code, description, license_category, status, created_at, updated_at, vendor_id) FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, message, status, notification_type, created_at, updated_at, "organizationIdId") FROM stdin;
\.


--
-- Data for Name: organization_licenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organization_licenses (id, description, license_period, license_period_count, license_reference_number, status, expires_at, created_at, updated_at, organization_id, license_id, requested_by, approved_by, license_request) FROM stdin;
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizations (id, name, tin, province, representative_name, representative_phone_number, organization_type, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, start_period, end_period, payment_fee, payment_status, order_number, created_at, updated_at, contract) FROM stdin;
\.


--
-- Data for Name: privileges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.privileges (id, name, description, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: report_licenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report_licenses (id, description, start_date, end_date, payment_reference, period_cost, doc_reference_link, payment_status, created_at, updated_at, payment_period, created_by) FROM stdin;
\.


--
-- Data for Name: request_audit_trails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_audit_trails (id, action_type, created_at, updated_at, user_id, request_id) FROM stdin;
\.


--
-- Data for Name: role_privileges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_privileges (id, created_at, updated_at, role_id, privilege_id) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: system_functions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_functions (id, created_at, updated_at, system_tool, system_function) FROM stdin;
\.


--
-- Data for Name: system_tools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_tools (id, system_tool_name, description, created_at, updated_at, department) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, username, email, status, user_type, created_at, updated_at, role_id, organization_id, department) FROM stdin;
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors (id, vendor_name, vendor_website, description, status, created_at, updated_at) FROM stdin;
\.


--
-- Name: certificate_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificate_reports_id_seq', 1, false);


--
-- Name: certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificates_id_seq', 1, false);


--
-- Name: components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.components_id_seq', 1, false);


--
-- Name: contract_reminders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contract_reminders_id_seq', 1, false);


--
-- Name: contract_system_tools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contract_system_tools_id_seq', 1, false);


--
-- Name: contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contracts_id_seq', 1, false);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 1, false);


--
-- Name: functions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.functions_id_seq', 1, false);


--
-- Name: license_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.license_requests_id_seq', 1, false);


--
-- Name: licenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.licenses_id_seq', 1, false);


--
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_id_seq', 1, false);


--
-- Name: organization_licenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organization_licenses_id_seq', 1, false);


--
-- Name: organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organizations_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: privileges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.privileges_id_seq', 1, false);


--
-- Name: report_licenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.report_licenses_id_seq', 1, false);


--
-- Name: request_audit_trails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_audit_trails_id_seq', 1, false);


--
-- Name: role_privileges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_privileges_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: system_functions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_functions_id_seq', 1, false);


--
-- Name: system_tools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_tools_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 1, false);


--
-- Name: system_functions PK_08b0a6a8739bbdcb70ca20239a6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_functions
    ADD CONSTRAINT "PK_08b0a6a8739bbdcb70ca20239a6" PRIMARY KEY (id);


--
-- Name: components PK_0d742661c63926321b5f5eac1ad; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT "PK_0d742661c63926321b5f5eac1ad" PRIMARY KEY (id);


--
-- Name: privileges PK_13f3ff98ae4d5565ec5ed6036cd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privileges
    ADD CONSTRAINT "PK_13f3ff98ae4d5565ec5ed6036cd" PRIMARY KEY (id);


--
-- Name: system_tools PK_189ce372f95dd6dd8519175b203; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_tools
    ADD CONSTRAINT "PK_189ce372f95dd6dd8519175b203" PRIMARY KEY (id);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: contract_system_tools PK_1a6d6ff83eba92a49801fe3f914; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_system_tools
    ADD CONSTRAINT "PK_1a6d6ff83eba92a49801fe3f914" PRIMARY KEY (id);


--
-- Name: functions PK_203889d2ae5a98ffc137739301e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.functions
    ADD CONSTRAINT "PK_203889d2ae5a98ffc137739301e" PRIMARY KEY (id);


--
-- Name: contracts PK_2c7b8f3a7b1acdd49497d83d0fb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY (id);


--
-- Name: contract_reminders PK_3a836cc3f6982527b6b83013183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_reminders
    ADD CONSTRAINT "PK_3a836cc3f6982527b6b83013183" PRIMARY KEY (id);


--
-- Name: organization_licenses PK_4dc5f4e9453cc4b8aab8502deb2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_licenses
    ADD CONSTRAINT "PK_4dc5f4e9453cc4b8aab8502deb2" PRIMARY KEY (id);


--
-- Name: certificate_reports PK_5974023591065a65619d406c3cd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_reports
    ADD CONSTRAINT "PK_5974023591065a65619d406c3cd" PRIMARY KEY (id);


--
-- Name: organizations PK_6b031fcd0863e3f6b44230163f9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY (id);


--
-- Name: notification PK_705b6c7cdf9b2c2ff7ac7872cb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY (id);


--
-- Name: license_requests PK_7561b8453a5717527d70f32e04c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.license_requests
    ADD CONSTRAINT "PK_7561b8453a5717527d70f32e04c" PRIMARY KEY (id);


--
-- Name: report_licenses PK_830eeeb0372018eee9550915cee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_licenses
    ADD CONSTRAINT "PK_830eeeb0372018eee9550915cee" PRIMARY KEY (id);


--
-- Name: departments PK_839517a681a86bb84cbcc6a1e9d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY (id);


--
-- Name: request_audit_trails PK_96f46402c883b979c86e0f60788; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_audit_trails
    ADD CONSTRAINT "PK_96f46402c883b979c86e0f60788" PRIMARY KEY (id);


--
-- Name: vendors PK_9c956c9797edfae5c6ddacc4e6e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT "PK_9c956c9797edfae5c6ddacc4e6e" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: licenses PK_da5021501ce80efa03de6f40086; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT "PK_da5021501ce80efa03de6f40086" PRIMARY KEY (id);


--
-- Name: certificates PK_e4c7e31e2144300bea7d89eb165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "PK_e4c7e31e2144300bea7d89eb165" PRIMARY KEY (id);


--
-- Name: role_privileges PK_f671486fe8eab3081c087946f2c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_privileges
    ADD CONSTRAINT "PK_f671486fe8eab3081c087946f2c" PRIMARY KEY (id);


--
-- Name: report_licenses REL_2f02056b7df566186530dde4e6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_licenses
    ADD CONSTRAINT "REL_2f02056b7df566186530dde4e6" UNIQUE (payment_period);


--
-- Name: organization_licenses REL_99e13f95ecbb2d172bf38cbbf5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_licenses
    ADD CONSTRAINT "REL_99e13f95ecbb2d172bf38cbbf5" UNIQUE (license_request);


--
-- Name: organizations UQ_1f4ab55d8ac2d02ba01eed09d89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT "UQ_1f4ab55d8ac2d02ba01eed09d89" UNIQUE (tin);


--
-- Name: licenses UQ_543cfb437043963bb8fc6e67c69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT "UQ_543cfb437043963bb8fc6e67c69" UNIQUE (name);


--
-- Name: roles UQ_648e3f5447f725579d7d4ffdfb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE (name);


--
-- Name: departments UQ_8681da666ad9699d568b3e91064; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT "UQ_8681da666ad9699d568b3e91064" UNIQUE (name);


--
-- Name: privileges UQ_913e0b87d35069ac7bd7982d889; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privileges
    ADD CONSTRAINT "UQ_913e0b87d35069ac7bd7982d889" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: organizations UQ_9b7ca6d30b94fef571cff876884; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT "UQ_9b7ca6d30b94fef571cff876884" UNIQUE (name);


--
-- Name: functions UQ_c16b68177fcec6e85aa50922972; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.functions
    ADD CONSTRAINT "UQ_c16b68177fcec6e85aa50922972" UNIQUE (name);


--
-- Name: licenses UQ_d3e0749d6bab34406b1399512d2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT "UQ_d3e0749d6bab34406b1399512d2" UNIQUE (code);


--
-- Name: contracts UQ_db84c172dc74e6271e614b68fbd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "UQ_db84c172dc74e6271e614b68fbd" UNIQUE (contract_number);


--
-- Name: vendors UQ_dc7218e0fd02f264a12398f6b1c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT "UQ_dc7218e0fd02f264a12398f6b1c" UNIQUE (vendor_name);


--
-- Name: certificates UQ_dd350967f03b76262b50359abc6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "UQ_dd350967f03b76262b50359abc6" UNIQUE (certificate);


--
-- Name: system_tools UQ_f90263c9ab21c9a13bde59a2711; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_tools
    ADD CONSTRAINT "UQ_f90263c9ab21c9a13bde59a2711" UNIQUE (system_tool_name);


--
-- Name: organization_licenses FK_08d01e28be42821d2ef89bfd692; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_licenses
    ADD CONSTRAINT "FK_08d01e28be42821d2ef89bfd692" FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: organization_licenses FK_14ef7f44bf19c328b499c01bf89; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_licenses
    ADD CONSTRAINT "FK_14ef7f44bf19c328b499c01bf89" FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: users FK_21a659804ed7bf61eb91688dea7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_21a659804ed7bf61eb91688dea7" FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: report_licenses FK_2f02056b7df566186530dde4e6c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_licenses
    ADD CONSTRAINT "FK_2f02056b7df566186530dde4e6c" FOREIGN KEY (payment_period) REFERENCES public.payments(id);


--
-- Name: organization_licenses FK_2f2636ea984bdf933a10dc72bc3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_licenses
    ADD CONSTRAINT "FK_2f2636ea984bdf933a10dc72bc3" FOREIGN KEY (requested_by) REFERENCES public.users(id);


--
-- Name: components FK_3423601a5604ad712a8fb19bd06; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT "FK_3423601a5604ad712a8fb19bd06" FOREIGN KEY (contract) REFERENCES public.contracts(id);


--
-- Name: contract_system_tools FK_3db817dc7443df2832d38b2d8cf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_system_tools
    ADD CONSTRAINT "FK_3db817dc7443df2832d38b2d8cf" FOREIGN KEY ("systemToolId") REFERENCES public.system_tools(id);


--
-- Name: licenses FK_47ae80077d102b313d9572b14a0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT "FK_47ae80077d102b313d9572b14a0" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: contracts FK_4b9cd239228624528134f7d6ec3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "FK_4b9cd239228624528134f7d6ec3" FOREIGN KEY (vendor) REFERENCES public.vendors(id);


--
-- Name: contract_reminders FK_67c7a6f5cc9d94f030a831f998a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_reminders
    ADD CONSTRAINT "FK_67c7a6f5cc9d94f030a831f998a" FOREIGN KEY (contract) REFERENCES public.contracts(id);


--
-- Name: role_privileges FK_6a6438e163c9c40c41288ebc9bf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_privileges
    ADD CONSTRAINT "FK_6a6438e163c9c40c41288ebc9bf" FOREIGN KEY (privilege_id) REFERENCES public.privileges(id);


--
-- Name: request_audit_trails FK_7130ac8f0c26e753f2418eba976; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_audit_trails
    ADD CONSTRAINT "FK_7130ac8f0c26e753f2418eba976" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: contracts FK_73be7a4c4b05588bed24b7f7315; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "FK_73be7a4c4b05588bed24b7f7315" FOREIGN KEY (system_tool) REFERENCES public.system_tools(id);


--
-- Name: request_audit_trails FK_835174c2c0708a7239aa6a1a8d3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_audit_trails
    ADD CONSTRAINT "FK_835174c2c0708a7239aa6a1a8d3" FOREIGN KEY (request_id) REFERENCES public.license_requests(id);


--
-- Name: contract_system_tools FK_89d6ffec3c8eb2084536963c2ff; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_system_tools
    ADD CONSTRAINT "FK_89d6ffec3c8eb2084536963c2ff" FOREIGN KEY ("contractId") REFERENCES public.contracts(id);


--
-- Name: system_tools FK_8beab7a2e98d5df3dea590cd5b5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_tools
    ADD CONSTRAINT "FK_8beab7a2e98d5df3dea590cd5b5" FOREIGN KEY (department) REFERENCES public.departments(id);


--
-- Name: organization_licenses FK_8f779faaa18971fe7f2de1a2514; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_licenses
    ADD CONSTRAINT "FK_8f779faaa18971fe7f2de1a2514" FOREIGN KEY (license_id) REFERENCES public.licenses(id);


--
-- Name: organization_licenses FK_99e13f95ecbb2d172bf38cbbf54; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_licenses
    ADD CONSTRAINT "FK_99e13f95ecbb2d172bf38cbbf54" FOREIGN KEY (license_request) REFERENCES public.license_requests(id);


--
-- Name: notification FK_9b31b5e25808b7589323f5d94fa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_9b31b5e25808b7589323f5d94fa" FOREIGN KEY ("organizationIdId") REFERENCES public.organizations(id);


--
-- Name: license_requests FK_9d0a307bbfbe22aa4db3f2542c5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.license_requests
    ADD CONSTRAINT "FK_9d0a307bbfbe22aa4db3f2542c5" FOREIGN KEY (requested_by) REFERENCES public.users(id);


--
-- Name: certificate_reports FK_a0e9e8cc35638e5bc301a7e95b0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_reports
    ADD CONSTRAINT "FK_a0e9e8cc35638e5bc301a7e95b0" FOREIGN KEY (certificate) REFERENCES public.certificates(id);


--
-- Name: users FK_a2cecd1a3531c0b041e29ba46e1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: certificate_reports FK_a3ecfa455deb458856d1c5d314e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_reports
    ADD CONSTRAINT "FK_a3ecfa455deb458856d1c5d314e" FOREIGN KEY (responsible) REFERENCES public.users(id);


--
-- Name: system_functions FK_b5b4cbe0b17c56e169ccb0b7b75; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_functions
    ADD CONSTRAINT "FK_b5b4cbe0b17c56e169ccb0b7b75" FOREIGN KEY (system_function) REFERENCES public.functions(id);


--
-- Name: report_licenses FK_bc1380156571dcec4314ed3e665; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_licenses
    ADD CONSTRAINT "FK_bc1380156571dcec4314ed3e665" FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: contract_reminders FK_bcc0414d88614c736a98674d877; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_reminders
    ADD CONSTRAINT "FK_bcc0414d88614c736a98674d877" FOREIGN KEY ("user") REFERENCES public.users(id);


--
-- Name: system_functions FK_c0fb62491e14ff0870cdad330f1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_functions
    ADD CONSTRAINT "FK_c0fb62491e14ff0870cdad330f1" FOREIGN KEY (system_tool) REFERENCES public.system_tools(id);


--
-- Name: users FK_c162e1fe9d744b0721daea3b1c1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_c162e1fe9d744b0721daea3b1c1" FOREIGN KEY (department) REFERENCES public.departments(id);


--
-- Name: role_privileges FK_c2ab0794b38051da6c6bee31aa4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_privileges
    ADD CONSTRAINT "FK_c2ab0794b38051da6c6bee31aa4" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: contracts FK_c9d1b24f9058701e252640e56c0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "FK_c9d1b24f9058701e252640e56c0" FOREIGN KEY (department) REFERENCES public.departments(id);


--
-- Name: payments FK_d70e27e0533b5d853c17c3bba08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_d70e27e0533b5d853c17c3bba08" FOREIGN KEY (contract) REFERENCES public.contracts(id);


--
-- Name: license_requests FK_de910989b98c2ac7a6ecc52c2c9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.license_requests
    ADD CONSTRAINT "FK_de910989b98c2ac7a6ecc52c2c9" FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: certificates FK_df4bef94210f59117f5c35bf2f1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "FK_df4bef94210f59117f5c35bf2f1" FOREIGN KEY (department) REFERENCES public.departments(id);


--
-- Name: license_requests FK_f7884a410eae36c57dfc2d9a717; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.license_requests
    ADD CONSTRAINT "FK_f7884a410eae36c57dfc2d9a717" FOREIGN KEY (license_id) REFERENCES public.licenses(id);


--
-- PostgreSQL database dump complete
--


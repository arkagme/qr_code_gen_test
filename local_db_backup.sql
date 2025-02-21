--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.15 (Homebrew)

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
-- Name: analytics; Type: TABLE; Schema: public; Owner: arkapravagaine
--

CREATE TABLE public.analytics (
    id integer NOT NULL,
    qr_code_id text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_agent text,
    ip_address text
);


ALTER TABLE public.analytics OWNER TO arkapravagaine;

--
-- Name: analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: arkapravagaine
--

CREATE SEQUENCE public.analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.analytics_id_seq OWNER TO arkapravagaine;

--
-- Name: analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arkapravagaine
--

ALTER SEQUENCE public.analytics_id_seq OWNED BY public.analytics.id;


--
-- Name: qr_codes; Type: TABLE; Schema: public; Owner: arkapravagaine
--

CREATE TABLE public.qr_codes (
    id text NOT NULL,
    target_url text NOT NULL,
    with_logo boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.qr_codes OWNER TO arkapravagaine;

--
-- Name: analytics id; Type: DEFAULT; Schema: public; Owner: arkapravagaine
--

ALTER TABLE ONLY public.analytics ALTER COLUMN id SET DEFAULT nextval('public.analytics_id_seq'::regclass);


--
-- Data for Name: analytics; Type: TABLE DATA; Schema: public; Owner: arkapravagaine
--

COPY public.analytics (id, qr_code_id, "timestamp", user_agent, ip_address) FROM stdin;
\.


--
-- Data for Name: qr_codes; Type: TABLE DATA; Schema: public; Owner: arkapravagaine
--

COPY public.qr_codes (id, target_url, with_logo, created_at) FROM stdin;
afa27f3da88371b4	https://devdays.com	t	2025-02-21 19:18:16.095554
\.


--
-- Name: analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arkapravagaine
--

SELECT pg_catalog.setval('public.analytics_id_seq', 1, false);


--
-- Name: analytics analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: arkapravagaine
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);


--
-- Name: qr_codes qr_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: arkapravagaine
--

ALTER TABLE ONLY public.qr_codes
    ADD CONSTRAINT qr_codes_pkey PRIMARY KEY (id);


--
-- Name: idx_analytics_qr_code_id; Type: INDEX; Schema: public; Owner: arkapravagaine
--

CREATE INDEX idx_analytics_qr_code_id ON public.analytics USING btree (qr_code_id);


--
-- Name: idx_analytics_timestamp; Type: INDEX; Schema: public; Owner: arkapravagaine
--

CREATE INDEX idx_analytics_timestamp ON public.analytics USING btree ("timestamp");


--
-- Name: analytics analytics_qr_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: arkapravagaine
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_qr_code_id_fkey FOREIGN KEY (qr_code_id) REFERENCES public.qr_codes(id);


--
-- PostgreSQL database dump complete
--


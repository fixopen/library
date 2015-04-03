--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: actiontype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE actiontype AS ENUM (
    'Follow',
    'View',
    'Download'
);


ALTER TYPE actiontype OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: administrator; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE administrator (
    id bigint NOT NULL,
    name character varying(32),
    password character varying(64)
);


ALTER TABLE administrator OWNER TO postgres;

--
-- Name: book; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE book (
    id bigint NOT NULL,
    name character varying(256),
    author character varying(128),
    "authorAlias" character varying(128),
    publisher character varying(256),
    "publishTime" character varying(16),
    isbn character varying(24),
    "standardClassify" character varying(16),
    "firstLevelClassify" character varying(16),
    "secondLevelClassify" character varying(16),
    "authorizationEndTime" timestamp(4) without time zone,
    keywords character varying(256),
    abstract text,
    "order" bigint,
    "resourceId" bigint
);


ALTER TABLE book OWNER TO postgres;

--
-- Name: business; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE business (
    id bigint NOT NULL,
    "userId" bigint,
    "deviceId" bigint,
    "time" timestamp(4) without time zone,
    action actiontype
);


ALTER TABLE business OWNER TO postgres;

--
-- Name: device; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE device (
    id bigint NOT NULL,
    no character varying(32),
    address character varying(64),
    location point,
    "lastOperationTime" timestamp(4) without time zone,
    "lastUpdateTime" timestamp(4) without time zone,
    "controlNo" character varying(32),
    "controlPassword" character varying(32)
);


ALTER TABLE device OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "user" (
    id bigint NOT NULL,
    no character varying(32),
    "registerTime" timestamp(4) with time zone
);


ALTER TABLE "user" OWNER TO postgres;

--
-- Data for Name: administrator; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: business; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: device; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: administrator_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY administrator
    ADD CONSTRAINT administrator_pk PRIMARY KEY (id);


--
-- Name: book_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY book
    ADD CONSTRAINT book_pk PRIMARY KEY (id);


--
-- Name: business_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY business
    ADD CONSTRAINT business_pk PRIMARY KEY (id);


--
-- Name: device_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY device
    ADD CONSTRAINT device_pk PRIMARY KEY (id);


--
-- Name: name_u; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY administrator
    ADD CONSTRAINT name_u UNIQUE (name);


--
-- Name: user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- Name: business_device_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY business
    ADD CONSTRAINT business_device_fk FOREIGN KEY ("deviceId") REFERENCES device(id);


--
-- Name: business_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY business
    ADD CONSTRAINT business_user_fk FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--


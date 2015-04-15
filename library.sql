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


ALTER TYPE public.actiontype OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: administrator; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE administrator (
    id bigint NOT NULL,
    name character varying(32),
    password character varying(64),
    "sessionId" character varying(32),
    "lastOperationTime" bigint
);


ALTER TABLE public.administrator OWNER TO postgres;

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
    "lastUpdateTime" timestamp(4) without time zone,
    "mimeType" character varying(32),
    "resourceId" character varying(32),
    "isBan" boolean DEFAULT false
);


ALTER TABLE public.book OWNER TO postgres;

--
-- Name: business; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE business (
    id bigint NOT NULL,
    "userId" bigint,
    "deviceId" bigint,
    "time" timestamp(4) without time zone,
    action actiontype,
    "bookId" bigint
);


ALTER TABLE public.business OWNER TO postgres;

--
-- Name: device; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE device (
    id bigint NOT NULL,
    no character varying(32),
    address character varying(64),
    location point,
    "lastUpdateTime" timestamp(4) without time zone,
    "controlNo" character varying(32),
    "controlPassword" character varying(32),
    "sessionId" character varying(32),
    "lastOperationTime" bigint,
    "ipAddress" name
);


ALTER TABLE public.device OWNER TO postgres;

--
-- Name: systemParameter; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "systemParameter" (
    id bigint NOT NULL,
    name character varying(32),
    value text
);


ALTER TABLE public."systemParameter" OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "user" (
    id bigint NOT NULL,
    no character varying(32),
    "registerTime" timestamp(4) without time zone,
    "sessionId" character varying(32),
    "lastOperationTime" bigint
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: administrator; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO administrator VALUES (1, 'admin', 'admin', '757728436', 1428371079);


--
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO book VALUES (29154, '错币', '陈一夫', '陈一夫', '九州出版社', '2013/09/', '978-7-5108-2102-8', 'I247.54', '小说', '财经小说', '2015-12-31 00:00:00', '长篇小说--中国--现代', '五一支行行长龚梅为了阮大头非法融资而来的二亿美元存款，与至大支行进行着斗智、斗色、斗狠的残酷竞争。中央银行的康处长自打弃官作了职业诗人之后，除了写诗、打工之外，捉奸便成了他生活的一部分。他发现五一支行的小职员谭白虎和民营老板阮大头都与漂亮老婆龚梅似乎有着某种暧昧。突然，一个持枪、戴口罩的歹徒出现了，几声枪响之后，商战的残酷、猜疑的无奈都伴随着三个生命在银行营业厅的结束而消失。', NULL, '2015-04-07 16:40:22.7699', 'application/pdf', NULL, false);
INSERT INTO book VALUES (106, '做人做事做生意——解读李', '言诚', '言诚', '湖南人民出版社', '', '978-7-5438-4777-4', 'F715-49', '经济', '财经人物', '2017-05-23 00:00:00', '商业经营--心理交往--通俗读物', '本书详细解读了李嘉诚经商不败的奥秘，内容主要包括：未学做事，先学做人；最适合做生意的人；商界新人必备素养；成功需要自我修炼等。', NULL, '2015-04-07 18:15:22.1985', 'text/plain', NULL, false);


--
-- Data for Name: business; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO business VALUES (-426508288, NULL, NULL, '2015-04-15 00:00:00', 'Follow', 29154);


--
-- Data for Name: device; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO device VALUES (93658045677568, 'd12345', 'ccj', NULL, NULL, 'ywu32412342352', '2345346', NULL, NULL, '100.38.24.31');


--
-- Data for Name: systemParameter; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- Name: systemparameter_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "systemParameter"
    ADD CONSTRAINT systemparameter_pk PRIMARY KEY (id);


--
-- Name: user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- Name: fki_business_book_fk; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX fki_business_book_fk ON business USING btree ("bookId");


--
-- Name: business_book_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY business
    ADD CONSTRAINT business_book_fk FOREIGN KEY ("bookId") REFERENCES book(id);


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


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
-- Name: calltype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE calltype AS ENUM (
    'Unconnection',
    'In',
    'Out',
    'LeaveWord',
    'Local'
);


ALTER TYPE public.calltype OWNER TO postgres;

--
-- Name: grouptype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE grouptype AS ENUM (
    'Contact',
    'Device',
    'User',
    'Markup'
);


ALTER TYPE public.grouptype OWNER TO postgres;

--
-- Name: operation; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE operation AS ENUM (
    'SELECT',
    'INSERT',
    'DELETE',
    'UPDATE'
);


ALTER TYPE public.operation OWNER TO postgres;

--
-- Name: powertype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE powertype AS ENUM (
    'Administrator',
    'Common',
    'NormalTelephoneUser'
);


ALTER TYPE public.powertype OWNER TO postgres;

--
-- Name: pushmessagestatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE pushmessagestatus AS ENUM (
    'Editing',
    'Publisher',
    'Over'
);


ALTER TYPE public.pushmessagestatus OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: call; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE call (
    id bigint NOT NULL,
    "userId" bigint,
    "deviceId" bigint,
    "localTelephoneNumber" character varying(16),
    type calltype,
    "remoteTelephoneNumber" character varying(16),
    "contactId" bigint,
    "startTime" timestamp without time zone,
    duration interval,
    "recordCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.call OWNER TO postgres;

--
-- Name: contact; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE contact (
    id bigint NOT NULL,
    no character varying(64),
    name character varying(64),
    alias character varying(64),
    photo character varying(128),
    description text,
    address character varying(128),
    zipcode character varying(8),
    title character varying(32),
    telephone character varying(32),
    ext character varying(8),
    mobile character varying(16),
    email character varying(64),
    qq character varying(16),
    sip character varying(32),
    website character varying(32),
    "isPrivate" boolean
);


ALTER TABLE public.contact OWNER TO postgres;

--
-- Name: contactGroupMap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "contactGroupMap" (
    id bigint NOT NULL,
    "contactId" bigint,
    "groupId" bigint
);


ALTER TABLE public."contactGroupMap" OWNER TO postgres;

--
-- Name: dataType; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "dataType" (
    id bigint NOT NULL,
    name character varying(32),
    description text
);


ALTER TABLE public."dataType" OWNER TO postgres;

--
-- Name: device; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE device (
    id bigint NOT NULL,
    no character varying(32),
    name character varying(32),
    "groupId" bigint,
    "userId" bigint,
    prefix smallint,
    description text,
    state character varying(8)
);


ALTER TABLE public.device OWNER TO postgres;

--
-- Name: group; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "group" (
    id bigint NOT NULL,
    "parentId" bigint,
    no character varying(16),
    name character varying(16),
    image character varying(128),
    description text,
    type grouptype,
    "isPrivate" boolean
);


ALTER TABLE public."group" OWNER TO postgres;

--
-- Name: log; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE log (
    id bigint NOT NULL,
    "userId" bigint,
    "timestamp" timestamp without time zone,
    description text,
    "dataTypeId" bigint,
    "dataId" bigint,
    operation operation
);


ALTER TABLE public.log OWNER TO postgres;

--
-- Name: markup; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE markup (
    id bigint NOT NULL,
    "userId" bigint,
    "dataTypeId" bigint,
    "dataId" bigint,
    "groupId" bigint,
    name character varying(32),
    value text
);


ALTER TABLE public.markup OWNER TO postgres;

--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE media (
    id bigint NOT NULL,
    name character varying(64),
    content character varying(128),
    "mimeType" character varying(64),
    "applicationType" character varying(64),
    length bigint,
    "userId" bigint,
    "deviceId" bigint,
    "createTime" timestamp without time zone
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: permission; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE permission (
    id bigint NOT NULL,
    name character varying(32),
    operation operation,
    "dataTypeId" bigint,
    "attributeBag" character varying(32)[],
    "regionExpression" json
);


ALTER TABLE public.permission OWNER TO postgres;

--
-- Name: pushMessage; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "pushMessage" (
    id bigint NOT NULL,
    "dataTypeId" bigint,
    "creatorId" bigint,
    "createTime" timestamp without time zone,
    "startTime" timestamp without time zone,
    "stopTime" timestamp without time zone,
    "dataIds" bigint[],
    "receiverIds" bigint[]
);


ALTER TABLE public."pushMessage" OWNER TO postgres;

--
-- Name: pushMessageLog; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "pushMessageLog" (
    id bigint NOT NULL,
    "messageId" bigint,
    "userId" bigint,
    "deviceId" bigint,
    "time" timestamp without time zone
);


ALTER TABLE public."pushMessageLog" OWNER TO postgres;

--
-- Name: record; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE record (
    id bigint NOT NULL,
    "callId" bigint,
    "startTime" timestamp without time zone,
    duration interval,
    filename character varying(128)
);


ALTER TABLE public.record OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE role (
    id bigint NOT NULL,
    name character varying(32),
    description text
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: rolePermissionMap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "rolePermissionMap" (
    id bigint NOT NULL,
    "roleId" bigint,
    "permissionId" bigint
);


ALTER TABLE public."rolePermissionMap" OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE session (
    id bigint NOT NULL,
    "sessionId" character varying(64),
    "userId" bigint,
    "startTime" timestamp without time zone,
    "appendInfo" json,
    "lastOperationTime" timestamp without time zone
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "user" (
    id bigint NOT NULL,
    no character varying(64),
    name character varying(64),
    alias character varying(64),
    photo character varying(128),
    description text,
    address character varying(128),
    zipcode character varying(8),
    title character varying(32),
    telephone character varying(32),
    ext character varying(8),
    mobile character varying(16),
    email character varying(64),
    qq character varying(16),
    sip character varying(32),
    website character varying(32),
    "organizationId" bigint,
    password character varying(64),
    login character varying(32)
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: userContactMap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "userContactMap" (
    id bigint NOT NULL,
    "userId" bigint,
    "contactId" bigint,
    "order" bigint
);


ALTER TABLE public."userContactMap" OWNER TO postgres;

--
-- Name: userGroupMap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "userGroupMap" (
    id bigint NOT NULL,
    "userId" bigint,
    "groupId" bigint,
    "order" bigint DEFAULT 0
);


ALTER TABLE public."userGroupMap" OWNER TO postgres;

--
-- Name: userPermissionMap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "userPermissionMap" (
    id bigint NOT NULL,
    "userId" bigint,
    "permissionId" bigint,
    "regionArguments" json
);


ALTER TABLE public."userPermissionMap" OWNER TO postgres;

--
-- Name: userRoleMap; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "userRoleMap" (
    id bigint NOT NULL,
    "userId" bigint,
    "roleId" bigint,
    "regionArguments" json[]
);


ALTER TABLE public."userRoleMap" OWNER TO postgres;

--
-- Data for Name: call; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: contact; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: contactGroupMap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: dataType; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: device; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: markup; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pushMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pushMessageLog; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: record; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rolePermissionMap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: userContactMap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: userGroupMap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: userPermissionMap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: userRoleMap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: call_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY call
    ADD CONSTRAINT call_pk PRIMARY KEY (id);


--
-- Name: contactGroupMap_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "contactGroupMap"
    ADD CONSTRAINT "contactGroupMap_pk" PRIMARY KEY (id);


--
-- Name: contact_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contact
    ADD CONSTRAINT contact_pk PRIMARY KEY (id);


--
-- Name: dataType_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "dataType"
    ADD CONSTRAINT "dataType_pk" PRIMARY KEY (id);


--
-- Name: device_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY device
    ADD CONSTRAINT device_pk PRIMARY KEY (id);


--
-- Name: group_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "group"
    ADD CONSTRAINT group_pk PRIMARY KEY (id);


--
-- Name: log_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY log
    ADD CONSTRAINT log_pk PRIMARY KEY (id);


--
-- Name: markup_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY markup
    ADD CONSTRAINT markup_pk PRIMARY KEY (id);


--
-- Name: media_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY media
    ADD CONSTRAINT media_pk PRIMARY KEY (id);


--
-- Name: permission_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY permission
    ADD CONSTRAINT permission_pk PRIMARY KEY (id);


--
-- Name: pushMessageLog_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "pushMessageLog"
    ADD CONSTRAINT "pushMessageLog_pk" PRIMARY KEY (id);


--
-- Name: pushMessage_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "pushMessage"
    ADD CONSTRAINT "pushMessage_pk" PRIMARY KEY (id);


--
-- Name: record_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY record
    ADD CONSTRAINT record_pk PRIMARY KEY (id);


--
-- Name: rolePermissionMap_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "rolePermissionMap"
    ADD CONSTRAINT "rolePermissionMap_pk" PRIMARY KEY (id);


--
-- Name: role_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY role
    ADD CONSTRAINT role_pk PRIMARY KEY (id);


--
-- Name: session_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY session
    ADD CONSTRAINT session_pk PRIMARY KEY (id);


--
-- Name: session_unique; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY session
    ADD CONSTRAINT session_unique UNIQUE ("sessionId");


--
-- Name: userContactMap_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "userContactMap"
    ADD CONSTRAINT "userContactMap_pk" PRIMARY KEY (id);


--
-- Name: userGroupMap_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "userGroupMap"
    ADD CONSTRAINT "userGroupMap_pk" PRIMARY KEY (id);


--
-- Name: userPermissionMap_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "userPermissionMap"
    ADD CONSTRAINT "userPermissionMap_pk" PRIMARY KEY (id);


--
-- Name: userRoleMap_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "userRoleMap"
    ADD CONSTRAINT "userRoleMap_pk" PRIMARY KEY (id);


--
-- Name: user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- Name: fki_device_group_fk; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX fki_device_group_fk ON device USING btree ("groupId");


--
-- Name: fki_device_user_pk; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX fki_device_user_pk ON device USING btree ("userId");


--
-- Name: fki_markup_dataType_fk; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX "fki_markup_dataType_fk" ON markup USING btree ("dataTypeId");


--
-- Name: fki_permission_dataType_fk; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX "fki_permission_dataType_fk" ON permission USING btree ("dataTypeId");


--
-- Name: fki_user_organization_fk; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX fki_user_organization_fk ON "user" USING btree ("organizationId");


--
-- Name: call_contact_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY call
    ADD CONSTRAINT call_contact_fk FOREIGN KEY ("contactId") REFERENCES contact(id);


--
-- Name: call_device_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY call
    ADD CONSTRAINT call_device_fk FOREIGN KEY ("deviceId") REFERENCES device(id);


--
-- Name: call_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY call
    ADD CONSTRAINT call_user_fk FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: contactGroupMap_contact_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "contactGroupMap"
    ADD CONSTRAINT "contactGroupMap_contact_fk" FOREIGN KEY ("contactId") REFERENCES contact(id);


--
-- Name: contactGroupMap_group_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "contactGroupMap"
    ADD CONSTRAINT "contactGroupMap_group_fk" FOREIGN KEY ("groupId") REFERENCES "group"(id);


--
-- Name: device_group_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY device
    ADD CONSTRAINT device_group_fk FOREIGN KEY ("groupId") REFERENCES "group"(id);


--
-- Name: device_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY device
    ADD CONSTRAINT device_user_fk FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: log_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY log
    ADD CONSTRAINT log_user_fk FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: markup_dataType_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY markup
    ADD CONSTRAINT "markup_dataType_fk" FOREIGN KEY ("dataTypeId") REFERENCES "dataType"(id);


--
-- Name: markup_group_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY markup
    ADD CONSTRAINT markup_group_fk FOREIGN KEY ("groupId") REFERENCES "group"(id);


--
-- Name: markup_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY markup
    ADD CONSTRAINT markup_user_fk FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: media_device_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY media
    ADD CONSTRAINT media_device_fk FOREIGN KEY ("deviceId") REFERENCES device(id);


--
-- Name: media_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY media
    ADD CONSTRAINT media_user_fk FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: permission_dataType_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY permission
    ADD CONSTRAINT "permission_dataType_fk" FOREIGN KEY ("dataTypeId") REFERENCES "dataType"(id);


--
-- Name: pushMessageLog_device_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "pushMessageLog"
    ADD CONSTRAINT "pushMessageLog_device_fk" FOREIGN KEY ("deviceId") REFERENCES device(id);


--
-- Name: pushMessageLog_pushMessage_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "pushMessageLog"
    ADD CONSTRAINT "pushMessageLog_pushMessage_fk" FOREIGN KEY ("messageId") REFERENCES "pushMessage"(id);


--
-- Name: pushMessageLog_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "pushMessageLog"
    ADD CONSTRAINT "pushMessageLog_user_fk" FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: pushMessage_dataType_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "pushMessage"
    ADD CONSTRAINT "pushMessage_dataType_fk" FOREIGN KEY ("dataTypeId") REFERENCES "dataType"(id);


--
-- Name: pushMessage_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "pushMessage"
    ADD CONSTRAINT "pushMessage_user_fk" FOREIGN KEY ("creatorId") REFERENCES "user"(id);


--
-- Name: record_call_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY record
    ADD CONSTRAINT record_call_fk FOREIGN KEY ("callId") REFERENCES call(id);


--
-- Name: rolePermissionMap_permission_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "rolePermissionMap"
    ADD CONSTRAINT "rolePermissionMap_permission_fk" FOREIGN KEY ("permissionId") REFERENCES permission(id);


--
-- Name: rolePermissionMap_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "rolePermissionMap"
    ADD CONSTRAINT "rolePermissionMap_role_fk" FOREIGN KEY ("roleId") REFERENCES role(id);


--
-- Name: session_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY session
    ADD CONSTRAINT session_user_fk FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: userContactMap_contact_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "userContactMap"
    ADD CONSTRAINT "userContactMap_contact_fk" FOREIGN KEY ("contactId") REFERENCES contact(id);


--
-- Name: userContactMap_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "userContactMap"
    ADD CONSTRAINT "userContactMap_user_fk" FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: userGroupMap_group_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "userGroupMap"
    ADD CONSTRAINT "userGroupMap_group_fk" FOREIGN KEY ("groupId") REFERENCES "group"(id);


--
-- Name: userGroupMap_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "userGroupMap"
    ADD CONSTRAINT "userGroupMap_user_fk" FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: userPermissionMap_permission_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "userPermissionMap"
    ADD CONSTRAINT "userPermissionMap_permission_fk" FOREIGN KEY ("permissionId") REFERENCES permission(id);


--
-- Name: userPermissionMap_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "userPermissionMap"
    ADD CONSTRAINT "userPermissionMap_user_fk" FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: userRoleMap_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "userRoleMap"
    ADD CONSTRAINT "userRoleMap_role_fk" FOREIGN KEY ("roleId") REFERENCES role(id);


--
-- Name: userRoleMap_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "userRoleMap"
    ADD CONSTRAINT "userRoleMap_user_fk" FOREIGN KEY ("userId") REFERENCES "user"(id);


--
-- Name: user_organization_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_organization_fk FOREIGN KEY ("organizationId") REFERENCES "group"(id);


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


--
-- PostgreSQL database dump
--

\restrict JV6HXPuGbO7iwmlx6fpBpzbZUBL7YMvm5pYxSmcK4JrLHIcIs2f9FUpc8dNSVvJ

-- Dumped from database version 16.12
-- Dumped by pg_dump version 16.12

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

ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS "tasks_projectId_fkey";
ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS "tasks_parentTaskId_fkey";
ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS "tasks_createdById_fkey";
ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS "tasks_assigneeId_fkey";
ALTER TABLE IF EXISTS ONLY public.task_tags DROP CONSTRAINT IF EXISTS "task_tags_taskId_fkey";
ALTER TABLE IF EXISTS ONLY public.task_tags DROP CONSTRAINT IF EXISTS "task_tags_tagId_fkey";
ALTER TABLE IF EXISTS ONLY public.task_assignees DROP CONSTRAINT IF EXISTS "task_assignees_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.task_assignees DROP CONSTRAINT IF EXISTS "task_assignees_taskId_fkey";
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS "refresh_tokens_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS "projects_ownerId_fkey";
ALTER TABLE IF EXISTS ONLY public.project_members DROP CONSTRAINT IF EXISTS "project_members_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.project_members DROP CONSTRAINT IF EXISTS "project_members_projectId_fkey";
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS "notifications_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS "notifications_taskId_fkey";
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS "notifications_projectId_fkey";
ALTER TABLE IF EXISTS ONLY public.group_projects DROP CONSTRAINT IF EXISTS "group_projects_projectId_fkey";
ALTER TABLE IF EXISTS ONLY public.group_projects DROP CONSTRAINT IF EXISTS "group_projects_groupId_fkey";
ALTER TABLE IF EXISTS ONLY public.group_members DROP CONSTRAINT IF EXISTS "group_members_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.group_members DROP CONSTRAINT IF EXISTS "group_members_groupId_fkey";
ALTER TABLE IF EXISTS ONLY public.daily_updates DROP CONSTRAINT IF EXISTS "daily_updates_taskId_fkey";
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS "comments_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS "comments_taskId_fkey";
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS "comments_parentCommentId_fkey";
ALTER TABLE IF EXISTS ONLY public.attachments DROP CONSTRAINT IF EXISTS "attachments_commentId_fkey";
ALTER TABLE IF EXISTS ONLY public.activity_logs DROP CONSTRAINT IF EXISTS "activity_logs_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.activity_logs DROP CONSTRAINT IF EXISTS "activity_logs_taskId_fkey";
ALTER TABLE IF EXISTS ONLY public.activity_logs DROP CONSTRAINT IF EXISTS "activity_logs_projectId_fkey";
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.tasks_status_idx;
DROP INDEX IF EXISTS public."tasks_projectId_idx";
DROP INDEX IF EXISTS public."tasks_parentTaskId_idx";
DROP INDEX IF EXISTS public."tasks_dueDate_idx";
DROP INDEX IF EXISTS public."tasks_createdById_idx";
DROP INDEX IF EXISTS public."tasks_assigneeId_idx";
DROP INDEX IF EXISTS public."task_tags_taskId_tagId_key";
DROP INDEX IF EXISTS public."task_tags_taskId_idx";
DROP INDEX IF EXISTS public."task_tags_tagId_idx";
DROP INDEX IF EXISTS public."task_assignees_userId_idx";
DROP INDEX IF EXISTS public."task_assignees_taskId_userId_key";
DROP INDEX IF EXISTS public."task_assignees_taskId_idx";
DROP INDEX IF EXISTS public.tags_name_key;
DROP INDEX IF EXISTS public."refresh_tokens_userId_idx";
DROP INDEX IF EXISTS public.refresh_tokens_token_key;
DROP INDEX IF EXISTS public."projects_ownerId_idx";
DROP INDEX IF EXISTS public."project_members_userId_idx";
DROP INDEX IF EXISTS public."project_members_projectId_userId_key";
DROP INDEX IF EXISTS public."project_members_projectId_idx";
DROP INDEX IF EXISTS public."notifications_userId_idx";
DROP INDEX IF EXISTS public."notifications_isRead_idx";
DROP INDEX IF EXISTS public."notifications_createdAt_idx";
DROP INDEX IF EXISTS public."group_projects_projectId_idx";
DROP INDEX IF EXISTS public."group_projects_groupId_projectId_key";
DROP INDEX IF EXISTS public."group_projects_groupId_idx";
DROP INDEX IF EXISTS public."group_members_userId_idx";
DROP INDEX IF EXISTS public."group_members_groupId_userId_key";
DROP INDEX IF EXISTS public."group_members_groupId_idx";
DROP INDEX IF EXISTS public."daily_updates_taskId_idx";
DROP INDEX IF EXISTS public.daily_updates_date_idx;
DROP INDEX IF EXISTS public."comments_userId_idx";
DROP INDEX IF EXISTS public."comments_taskId_idx";
DROP INDEX IF EXISTS public."attachments_commentId_idx";
DROP INDEX IF EXISTS public."activity_logs_userId_idx";
DROP INDEX IF EXISTS public."activity_logs_taskId_idx";
DROP INDEX IF EXISTS public."activity_logs_projectId_idx";
DROP INDEX IF EXISTS public."activity_logs_createdAt_idx";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS tasks_pkey;
ALTER TABLE IF EXISTS ONLY public.task_tags DROP CONSTRAINT IF EXISTS task_tags_pkey;
ALTER TABLE IF EXISTS ONLY public.task_assignees DROP CONSTRAINT IF EXISTS task_assignees_pkey;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS tags_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS projects_pkey;
ALTER TABLE IF EXISTS ONLY public.project_members DROP CONSTRAINT IF EXISTS project_members_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.groups DROP CONSTRAINT IF EXISTS groups_pkey;
ALTER TABLE IF EXISTS ONLY public.group_projects DROP CONSTRAINT IF EXISTS group_projects_pkey;
ALTER TABLE IF EXISTS ONLY public.group_members DROP CONSTRAINT IF EXISTS group_members_pkey;
ALTER TABLE IF EXISTS ONLY public.daily_updates DROP CONSTRAINT IF EXISTS daily_updates_pkey;
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS comments_pkey;
ALTER TABLE IF EXISTS ONLY public.attachments DROP CONSTRAINT IF EXISTS attachments_pkey;
ALTER TABLE IF EXISTS ONLY public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.tasks;
DROP TABLE IF EXISTS public.task_tags;
DROP TABLE IF EXISTS public.task_assignees;
DROP TABLE IF EXISTS public.tags;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.project_members;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.groups;
DROP TABLE IF EXISTS public.group_projects;
DROP TABLE IF EXISTS public.group_members;
DROP TABLE IF EXISTS public.daily_updates;
DROP TABLE IF EXISTS public.comments;
DROP TABLE IF EXISTS public.attachments;
DROP TABLE IF EXISTS public.activity_logs;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.activity_logs (
    id text NOT NULL,
    "userId" text NOT NULL,
    action text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text NOT NULL,
    metadata text,
    "projectId" text,
    "taskId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.activity_logs OWNER TO taskflow;

--
-- Name: attachments; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.attachments (
    id text NOT NULL,
    "commentId" text NOT NULL,
    filename text NOT NULL,
    path text NOT NULL,
    mimetype text NOT NULL,
    size integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.attachments OWNER TO taskflow;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.comments (
    id text NOT NULL,
    "taskId" text NOT NULL,
    "userId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "parentCommentId" text
);


ALTER TABLE public.comments OWNER TO taskflow;

--
-- Name: daily_updates; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.daily_updates (
    id text NOT NULL,
    "taskId" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    progress integer NOT NULL,
    status text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.daily_updates OWNER TO taskflow;

--
-- Name: group_members; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.group_members (
    id text NOT NULL,
    "groupId" text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public.group_members OWNER TO taskflow;

--
-- Name: group_projects; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.group_projects (
    id text NOT NULL,
    "groupId" text NOT NULL,
    "projectId" text NOT NULL
);


ALTER TABLE public.group_projects OWNER TO taskflow;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.groups (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    type text DEFAULT 'USER_GROUP'::text NOT NULL,
    color text DEFAULT '#1890ff'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.groups OWNER TO taskflow;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "projectId" text,
    "taskId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO taskflow;

--
-- Name: project_members; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.project_members (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "userId" text NOT NULL,
    role text DEFAULT 'MEMBER'::text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.project_members OWNER TO taskflow;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.projects (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    color text DEFAULT '#1890ff'::text NOT NULL,
    icon text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "projectCode" text,
    category text,
    "businessOwner" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    timeline jsonb,
    "ownerId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.projects OWNER TO taskflow;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    token text NOT NULL,
    "userId" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO taskflow;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.tags (
    id text NOT NULL,
    name text NOT NULL,
    color text DEFAULT '#3B82F6'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tags OWNER TO taskflow;

--
-- Name: task_assignees; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.task_assignees (
    id text NOT NULL,
    "taskId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.task_assignees OWNER TO taskflow;

--
-- Name: task_tags; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.task_tags (
    id text NOT NULL,
    "taskId" text NOT NULL,
    "tagId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.task_tags OWNER TO taskflow;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.tasks (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'TODO'::text NOT NULL,
    priority text DEFAULT 'MEDIUM'::text NOT NULL,
    "projectId" text NOT NULL,
    "assigneeId" text,
    "createdById" text NOT NULL,
    "parentTaskId" text,
    "dueDate" timestamp(3) without time zone,
    "startDate" timestamp(3) without time zone,
    progress integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.tasks OWNER TO taskflow;

--
-- Name: users; Type: TABLE; Schema: public; Owner: taskflow
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role text DEFAULT 'MEMBER'::text NOT NULL,
    "pinHash" text,
    "pinSetAt" timestamp(3) without time zone,
    "loginAttempts" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "lastLoginAt" timestamp(3) without time zone,
    "passwordResetToken" text,
    "passwordResetExpires" timestamp(3) without time zone,
    "pinResetToken" text,
    "pinResetExpires" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO taskflow;

--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.activity_logs (id, "userId", action, "entityType", "entityId", metadata, "projectId", "taskId", "createdAt") FROM stdin;
1258b922-61b0-4def-94d5-2f5b4b08c347	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	2180e987-c198-43a1-9c08-922e1a3a7a53	{"status":"IN_PROGRESS","progress":0}	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	2180e987-c198-43a1-9c08-922e1a3a7a53	2026-02-13 08:18:06.208
83ce4a1b-6f8a-4f9b-bd41-aad87a592c67	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	a6296db5-56ac-4324-b2ea-46913334e90b	{"status":"IN_REVIEW","progress":0}	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	a6296db5-56ac-4324-b2ea-46913334e90b	2026-02-13 08:18:09.112
334466fc-3df8-4abc-8b9c-3c9d97a254fd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	a6296db5-56ac-4324-b2ea-46913334e90b	{"status":"TODO","progress":0}	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	a6296db5-56ac-4324-b2ea-46913334e90b	2026-02-13 08:18:11.387
8f98ec42-39dc-4e0e-9e15-3938f6303001	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	2180e987-c198-43a1-9c08-922e1a3a7a53	{"status":"TODO","progress":0}	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	2180e987-c198-43a1-9c08-922e1a3a7a53	2026-02-13 08:18:12.832
2bf0aeea-23f6-4526-9107-40f8c7fe1cfe	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	2180e987-c198-43a1-9c08-922e1a3a7a53	{"status":"IN_PROGRESS","progress":0}	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	2180e987-c198-43a1-9c08-922e1a3a7a53	2026-02-13 09:13:07.777
bd2c4a38-bd97-4cff-afe1-8e9943bee0e9	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	929ddd71-bab7-4f5b-87e0-a9de50eb2e65	{"status":"HOLD","progress":0}	e0f83878-68cb-41d1-8702-0f1b6c483f73	929ddd71-bab7-4f5b-87e0-a9de50eb2e65	2026-02-14 07:29:03.067
4de8d923-0f42-44cf-92ce-0f05c00cd592	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	COMPLETED	task	a6296db5-56ac-4324-b2ea-46913334e90b	{"status":"DONE","progress":100}	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	a6296db5-56ac-4324-b2ea-46913334e90b	2026-02-14 17:52:43.716
62a4a0cb-45b2-4516-ad69-74bd8e3d44c6	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	929ddd71-bab7-4f5b-87e0-a9de50eb2e65	{"status":"IN_PROGRESS","progress":0}	e0f83878-68cb-41d1-8702-0f1b6c483f73	929ddd71-bab7-4f5b-87e0-a9de50eb2e65	2026-02-14 17:53:55.196
0cc47410-151b-4198-aa96-8eb03f0850d2	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	a6296db5-56ac-4324-b2ea-46913334e90b	{"status":"IN_PROGRESS","progress":100}	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	a6296db5-56ac-4324-b2ea-46913334e90b	2026-02-14 17:53:57.886
8c54a3f1-5a04-4635-bb44-71178f259d79	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	DELETED	task	05a358a9-b0d8-48c0-bd0f-7fdadb3db924	{"title":"task ที่ 3"}	225891bd-eb44-4597-81b4-d4ac4c36b301	\N	2026-02-15 12:10:31.442
db977edf-9269-4983-92fb-244e1e5d4f4b	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	c815595a-15a1-4122-a05e-5394658906b3	{"changes":["title","description","status","priority","assigneeIds","startDate","dueDate","progress"]}	e9487408-cfb3-41db-b47d-3f6ed81da018	c815595a-15a1-4122-a05e-5394658906b3	2026-02-16 06:21:51.68
ce445396-9a94-4f60-914e-f076942f8a04	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	CREATED	task	5454b8fe-1321-4d1d-9950-1bc2664c9606	{"title":"Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ"}	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-16 06:31:13.772
7e5296d1-5792-4bd4-89e9-fed3c867aa1d	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	CREATED	task	065b7da2-fd30-4327-98c8-eaa252e2c293	{"title":"คัดเลือก และ ศึกษาข้อมูลด้านเทคนิค สนับสนุนทีม กลยุทธ์ และคุณจุ๊บ เพื่อประเมิน ธนาคาร ที่มานำเสนอ"}	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	065b7da2-fd30-4327-98c8-eaa252e2c293	2026-02-16 06:32:16.774
699f97b8-43cd-44d9-9c63-89b583b38756	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	UPDATED	task	065b7da2-fd30-4327-98c8-eaa252e2c293	{"status":"IN_PROGRESS","progress":50}	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	065b7da2-fd30-4327-98c8-eaa252e2c293	2026-02-16 06:32:22.134
e0ec82af-f437-46e6-861f-94d1ed98c83c	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	DELETED	task	5a764d2f-21b9-4a46-8485-1deb484f80fb	{"title":"Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ"}	ea6d076f-a136-4776-9a97-81624d476b2d	\N	2026-02-16 08:55:39.355
d6c56025-23a6-4d0e-a48f-8845ac5deea6	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	COMPLETED	task	5454b8fe-1321-4d1d-9950-1bc2664c9606	{"status":"DONE","progress":100}	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-16 09:13:35.414
f0e75b9e-c9ad-4968-ba89-a9244514b0c4	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	UPDATED	task	5454b8fe-1321-4d1d-9950-1bc2664c9606	{"status":"TODO","progress":100}	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-16 09:13:53.812
c7743d64-8c69-41cf-b00d-fc6a741842fe	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	DELETED	task	9d2634fa-583b-437f-a5dc-6dffc2da7e7a	{"title":"สมมุติว่า Done"}	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	\N	2026-02-26 07:17:48.543
d5b515c9-bb08-412c-861e-b7277b6c6809	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	UPDATED	task	f1277d7c-2645-4ea1-8201-bef2aebead68	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	f1277d7c-2645-4ea1-8201-bef2aebead68	2026-02-26 11:06:25.877
c74170bc-8a0a-4320-856f-ec0fa60697c9	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	UPDATED	task	b85e694e-de7e-420c-adaf-e1278fb46365	{"status":"IN_PROGRESS","progress":0}	ef5179a3-452a-4cb5-b920-308926d729bc	b85e694e-de7e-420c-adaf-e1278fb46365	2026-02-27 09:54:05.57
e5bae044-71ac-4b73-b253-d0862e48422d	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	COMPLETED	task	b85e694e-de7e-420c-adaf-e1278fb46365	{"status":"DONE","progress":100}	ef5179a3-452a-4cb5-b920-308926d729bc	b85e694e-de7e-420c-adaf-e1278fb46365	2026-02-27 09:54:31.203
28b91fca-19cd-4201-ab8d-009ae59cf926	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	c7040ddb-dac2-4a83-8798-103d3116aa29	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	c7040ddb-dac2-4a83-8798-103d3116aa29	2026-03-04 04:38:01.355
354f31b8-aafb-47e3-95a4-a2b75dacd66c	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	c7040ddb-dac2-4a83-8798-103d3116aa29	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	c7040ddb-dac2-4a83-8798-103d3116aa29	2026-03-04 04:38:14.813
90092c71-fd89-4638-a43e-a89b6dc72fe5	c8bbd6df-cd0f-4b5a-8364-b052d8171595	DELETED	task	66d04583-adf6-4c71-abcb-a95285c36f1e	{"title":"ำๆำๆำๆำๆ"}	456d2de7-db65-4838-b503-b2138ff63090	\N	2026-03-04 04:50:50.001
67e15144-6259-4bdb-8f29-70e48e4cdeb3	c8bbd6df-cd0f-4b5a-8364-b052d8171595	DELETED	task	d7081d78-ae31-4835-8f3d-09ac6c447ef4	{"title":"พพพพ"}	456d2de7-db65-4838-b503-b2138ff63090	\N	2026-03-04 04:50:54.905
cf398fa7-1c3d-44a7-888c-63836fce0deb	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	f1277d7c-2645-4ea1-8201-bef2aebead68	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	f1277d7c-2645-4ea1-8201-bef2aebead68	2026-03-04 04:54:35.743
5b414ccf-5012-445e-a307-ca77ecb8cf27	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	f1277d7c-2645-4ea1-8201-bef2aebead68	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	f1277d7c-2645-4ea1-8201-bef2aebead68	2026-03-04 05:02:51.181
eaf9d17a-8602-4e82-8f47-d8656d1cdbf6	c8bbd6df-cd0f-4b5a-8364-b052d8171595	DELETED	task	bf3d2dfa-da46-4387-8424-2f1bd7795264	{"title":"ยกยอดจัดซื้อ"}	456d2de7-db65-4838-b503-b2138ff63090	\N	2026-03-04 05:03:27.67
d445a4b8-f08a-4d6d-8125-994d564aae0b	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	CREATED	task	a3f8be70-2552-4943-9ac0-69d0ec148f86	{"title":"TOR 12.20 12.28"}	456d2de7-db65-4838-b503-b2138ff63090	a3f8be70-2552-4943-9ac0-69d0ec148f86	2026-03-04 08:02:45.113
daec71d2-2f4e-484c-8f20-5afe50bcab02	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	UPDATED	task	a3f8be70-2552-4943-9ac0-69d0ec148f86	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	a3f8be70-2552-4943-9ac0-69d0ec148f86	2026-03-04 08:03:10.483
56b3b644-fe9c-436b-8b9a-0428ed0a2e8e	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	UPDATED	task	a3f8be70-2552-4943-9ac0-69d0ec148f86	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	a3f8be70-2552-4943-9ac0-69d0ec148f86	2026-03-04 08:08:02.87
2db5f4ae-99b4-4166-86e0-e145368206f7	c8bbd6df-cd0f-4b5a-8364-b052d8171595	CREATED	task	1c8e85d9-7a31-420a-ba50-271fca770ef1	{"title":"แบบประเมินร้านค้า "}	456d2de7-db65-4838-b503-b2138ff63090	1c8e85d9-7a31-420a-ba50-271fca770ef1	2026-03-10 02:30:30.412
f5c15a09-0cb2-4966-935e-7d0294c216d0	c8bbd6df-cd0f-4b5a-8364-b052d8171595	CREATED	task	ef7e7fff-a33b-4c6c-8b5d-ab246d6c3feb	{"title":"สร้างรายงาน Cash Flow ของพี่วี"}	456d2de7-db65-4838-b503-b2138ff63090	ef7e7fff-a33b-4c6c-8b5d-ab246d6c3feb	2026-03-10 02:33:41.365
4009fc62-6c0b-43b4-b692-d3ee9fe9078f	c8bbd6df-cd0f-4b5a-8364-b052d8171595	CREATED	task	d89e65a7-b78c-461b-a871-7f1847167f6a	{"title":"รายงานวิเคราะห์อายุสินค้าคงเหลือ"}	456d2de7-db65-4838-b503-b2138ff63090	d89e65a7-b78c-461b-a871-7f1847167f6a	2026-03-10 03:23:55.888
f0c52e98-24f8-4400-acfd-c1632bcb7136	c8bbd6df-cd0f-4b5a-8364-b052d8171595	CREATED	task	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	{"title":"รายงานทดสอบมูลค่าสุทธที่คราดว่าจะได้รับ "}	456d2de7-db65-4838-b503-b2138ff63090	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	2026-03-10 03:24:46.824
13a7e64a-10db-4fa4-984c-21f2b92c1239	c8bbd6df-cd0f-4b5a-8364-b052d8171595	CREATED	task	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	{"title":"รายงานแสดงตารางเปรียบเทียบสัดส่วนเหล็กต่อคอนกรีต"}	456d2de7-db65-4838-b503-b2138ff63090	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	2026-03-10 03:26:32.826
efa9cbdc-9e43-445d-b513-f60578dfc57c	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	c7040ddb-dac2-4a83-8798-103d3116aa29	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	c7040ddb-dac2-4a83-8798-103d3116aa29	2026-03-10 03:29:21.468
0dcf5a3b-43e3-4c92-af75-afd314cae607	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	ef7e7fff-a33b-4c6c-8b5d-ab246d6c3feb	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	ef7e7fff-a33b-4c6c-8b5d-ab246d6c3feb	2026-03-10 03:29:51.827
ac40a662-5178-4e9f-b066-d508fc18eac6	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	2026-03-10 03:30:00.58
d7682fed-9e9b-41d6-b288-208b5c66a443	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	2026-03-10 03:30:15.175
49e04abb-f8fd-4c5c-8bc3-673fdadd106f	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	2026-03-10 03:30:24.601
94123f2b-3699-4abe-a568-26fc90d30a8d	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	d89e65a7-b78c-461b-a871-7f1847167f6a	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	d89e65a7-b78c-461b-a871-7f1847167f6a	2026-03-10 03:30:36.786
f609b290-29e2-4596-ae9c-5cfc1abb5bfc	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	1c8e85d9-7a31-420a-ba50-271fca770ef1	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	1c8e85d9-7a31-420a-ba50-271fca770ef1	2026-03-10 03:30:50.707
6c1f3a94-0111-4240-bb74-21002fa5530a	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	f1277d7c-2645-4ea1-8201-bef2aebead68	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	f1277d7c-2645-4ea1-8201-bef2aebead68	2026-03-10 03:31:04.637
dd4a46fc-93eb-46ab-98fd-58b370ff6054	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	1c8e85d9-7a31-420a-ba50-271fca770ef1	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	1c8e85d9-7a31-420a-ba50-271fca770ef1	2026-03-10 03:44:39.567
515532a3-6275-41e9-95c7-b9e213a4b00d	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	2026-03-10 03:44:56.116
666328d1-03fb-4899-82ee-91630669004c	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	2026-03-10 03:45:04.725
53282e64-c345-407f-acda-fbe654334105	c8bbd6df-cd0f-4b5a-8364-b052d8171595	UPDATED	task	d89e65a7-b78c-461b-a871-7f1847167f6a	{"changes":["title","description","status","priority","assigneeIds","tagIds","startDate","dueDate","progress"]}	456d2de7-db65-4838-b503-b2138ff63090	d89e65a7-b78c-461b-a871-7f1847167f6a	2026-03-10 03:45:11.048
\.


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.attachments (id, "commentId", filename, path, mimetype, size, "createdAt") FROM stdin;
e4455489-fb52-4b0f-b362-2a5513d307e5	33171962-6748-4ace-aef1-99bb521e0787	1772006936026.png	/app/uploads/1772096574952-227896211.png	image/png	68458	2026-02-26 09:02:54.955
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.comments (id, "taskId", "userId", content, "createdAt", "updatedAt", "parentCommentId") FROM stdin;
998b99a0-4db5-44ec-916f-a5dae942d148	160311b5-716c-488c-9307-17937deb91fe	9cb88436-60c7-4271-897f-40357bec5bd3	คอมเม้นท์เล่น ๆ	2026-01-29 05:58:15.267	2026-01-29 05:58:15.267	\N
33171962-6748-4ace-aef1-99bb521e0787	5454b8fe-1321-4d1d-9950-1bc2664c9606	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	25/2/26 คุณจุ๊บ ส่งเอกสาร pitch deck งาน 4 ธนาคารมาให่ กานต์ แล้ว (KTC,KBANK,BBL,BAY) \nต้องทำสรุปความเห็นในมุม ของ user experince ของIT ไป ประกอบความเห็นให้พี่จุ๊บและคณะทำงาน	2026-02-26 09:02:54.903	2026-02-26 09:02:54.903	\N
dc8592b5-ef9f-42df-a252-3e65ef5bc85e	a3f8be70-2552-4943-9ac0-69d0ec148f86	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	ประชุมร่วมกับบัญชี	2026-03-04 08:03:50.233	2026-03-04 08:03:50.233	\N
ceed4848-eac1-44d6-b2df-3a6b1ebe1cdf	a3f8be70-2552-4943-9ac0-69d0ec148f86	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	ประชุมร่วมกับบัญชี	2026-03-04 08:04:46.028	2026-03-04 08:04:46.028	\N
a4eb9675-c708-4203-b9f0-11dcaa8417fb	a3f8be70-2552-4943-9ac0-69d0ec148f86	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	ประชุมร่วมกับบัญชี	2026-03-04 08:04:50.384	2026-03-04 08:04:50.384	\N
fa39dce3-f3b8-4c55-b9f7-39bee5170a65	a3f8be70-2552-4943-9ac0-69d0ec148f86	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	(image)	2026-03-04 08:05:09.741	2026-03-04 08:05:09.741	\N
b86d385c-664c-4551-aba8-a839d7e647e5	a3f8be70-2552-4943-9ac0-69d0ec148f86	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	https://drive.google.com/drive/folders/1a-Vi43BMIOFdu-ZtEPqOU9cyv3LySPtG	2026-03-04 08:07:03.717	2026-03-04 08:07:03.717	\N
45699511-ce15-437c-8608-7e9eedde7fd4	a3f8be70-2552-4943-9ac0-69d0ec148f86	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	https://drive.google.com/drive/folders/1a-Vi43BMIOFdu-ZtEPqOU9cyv3LySPtG	2026-03-04 08:07:12.004	2026-03-04 08:07:12.004	\N
367b2454-61a9-479f-beb1-691d653d82f6	a3f8be70-2552-4943-9ac0-69d0ec148f86	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	https://drive.google.com/drive/folders/1a-Vi43BMIOFdu-ZtEPqOU9cyv3LySPtG	2026-03-04 08:07:23.35	2026-03-04 08:07:23.35	\N
49cdb55d-32dc-49e6-b057-e554517fa3fe	a3f8be70-2552-4943-9ac0-69d0ec148f86	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	https://drive.google.com/drive/folders/1a-Vi43BMIOFdu-ZtEPqOU9cyv3LySPtG	2026-03-04 08:07:37.997	2026-03-04 08:07:37.997	\N
\.


--
-- Data for Name: daily_updates; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.daily_updates (id, "taskId", date, progress, status, notes, "createdAt") FROM stdin;
85598b9f-6ee3-4d6b-bba6-df0989dc9c12	160311b5-716c-488c-9307-17937deb91fe	2026-01-29 05:57:23.337	5	IN_PROGRESS	Final Plan	2026-01-29 05:57:23.337
4f98d64a-b4eb-48ca-8cbb-47b6d581e608	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-16 06:38:13.55	50	IN_PROGRESS	วันที่ 11/2/26 เข้ารับฟัง 2 ธนาคาร \n1.KTC Bank ให้ดอกเบี่ย อัตรา ที่ 0.9% มีค่าธรรมเนียมการใช้งานเครื่อง 350/เครื่อง หากยอดใช้งานไม่ถึงเดือน ละ 50000 บาท แต่สามารถ นำยอดเครื่องsiteอื่นมาถัวเฉลี่ยได้\n\n2.KBANK ให้อัตรา อัตรา 3.2 % มีค่าธรรมเนียมการใช้งานเครื่อง 450/เครื่อง หากยอดใช้งานไม่ถึงเดือน ละ 50,000 บาท \nถัวเฉลี่ยค่าธรรมเนียมได้ แต่ต้องมียอดใช้ที่500,00 บาท ในsite อื่น	2026-02-16 06:38:13.55
\.


--
-- Data for Name: group_members; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.group_members (id, "groupId", "userId") FROM stdin;
\.


--
-- Data for Name: group_projects; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.group_projects (id, "groupId", "projectId") FROM stdin;
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.groups (id, name, description, type, color, "createdAt", "updatedAt") FROM stdin;
37b79ddb-47d5-493b-81c0-84f0991fc719	ฝ่าย Digital Platform & Integration กานต์	\N	USER_GROUP	#722ed1	2026-02-16 06:52:19.436	2026-02-16 06:54:00.148
966190d7-4977-44aa-9106-e583c0ad4507	ฝ่าย Technology & Analytics พี่ตรี	\N	PROJECT_GROUP	#52c41a	2026-02-16 06:48:41.969	2026-02-16 06:54:08.059
39b0527c-ab71-48ec-977a-667cc2fa6934	ฝ่าย Technology & Analytics พี่ตรี	\N	USER_GROUP	#52c41a	2026-02-16 06:51:17.858	2026-02-16 06:54:17.658
f7410054-962c-47fe-9ff6-6bf02da1944d	ฝ่ายคอมพิวเตอร์ และเครือข่าย พี่เบิร์ด	\N	USER_GROUP	#faad14	2026-02-16 06:53:43.676	2026-02-16 06:54:25.403
fd71f4b9-903c-43b8-bf9a-3f3bdecc83c2	ฝ่ายพัฒนาระบบสารสนเทศ พีี่โจ	\N	USER_GROUP	#1890ff	2026-02-16 06:47:44.633	2026-02-16 06:54:35.845
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.notifications (id, "userId", type, title, message, "isRead", "projectId", "taskId", "createdAt") FROM stdin;
7336222e-01ec-4898-b018-7c073e945389	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-13 09:00:00.068
bcefedf1-8fe7-4334-83ed-516c5d18a180	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-13 09:00:00.076
0eb9b6ee-7bab-46d3-ac0b-63d60eeb7939	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-15 09:00:00.054
82aa6dce-7830-4182-9041-df515e6224dc	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-15 09:00:00.063
211fe0fc-12a6-4660-a629-9524b1c5c5f9	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-16 09:00:00.019
d83dd584-8a80-40f7-87d8-33100d7bcd60	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-16 09:00:00.024
b2364d20-b111-4cdd-ab63-efb4036a7bb5	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_COMPLETED	Task Completed	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" has been marked as completed	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-16 09:13:35.364
5903dc11-0358-4f83-b1f7-6f5c04d3d2f3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_DUE_SOON	Task Due Tomorrow	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is due tomorrow	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-17 09:00:00.042
b91afc78-e24a-4f9c-bf26-7440f8203ced	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-17 09:00:00.047
5022366c-fac2-45a6-b72e-e5b6d38eac90	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-17 09:00:00.049
bbc02cc4-b80f-4c9a-97b7-33fa5c4e658b	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-18 09:00:00.056
00d01cf2-29f7-42fa-9aed-eb19883998b5	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-18 09:00:00.062
7f1c5d8e-d308-4322-b39a-e41fd875664b	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-18 09:00:00.071
8ebfddf1-3589-4569-b910-96338798f100	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-19 09:00:00.05
5ce7cf95-6436-4bf0-8d1c-5461b386f98f	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-19 09:00:00.17
8b62fc9b-3347-4caf-aa50-b47bd1df2818	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-19 09:00:00.173
5609676f-36a4-4389-a62d-ae89db709137	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-20 09:00:00.05
5c2dc403-dc98-44af-8b08-f0e07179e6c5	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-20 09:00:00.054
1b1e068b-bfe9-4746-89e2-6de8639e7f0d	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-20 09:00:00.058
7d4d31ed-13d4-4383-b976-eb4c59de51b7	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-21 09:00:00.051
7cedee1c-7812-444c-ba6f-f910292f0424	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-21 09:00:00.055
912dbcd1-3e6d-4370-81e7-9d9250caa7a8	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-21 09:00:00.058
00162d42-eaaf-496c-884b-2e1f9590180c	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-22 09:00:00.057
0f5b7f5e-45a3-4a37-97b8-d4517c2501c8	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-22 09:00:00.074
a343758b-a53b-459e-98e9-a2f12b14a941	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-22 09:00:00.09
6404eea7-f507-4eef-b74b-f421f218225c	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-23 09:00:00.066
dcef4e49-39f2-4d07-8019-c0a7ea5c55ae	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-23 09:00:00.07
8e2eaccd-4380-46bf-8ac1-17b473357d56	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-23 09:00:00.074
0872ec5e-e8e6-452f-be3f-0aa0d24532ac	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-24 09:00:00.07
6126e989-8035-4710-9b8a-0fa68e1377b3	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-24 09:00:00.1
259ca402-67de-4db4-b6de-16ad4a8795e5	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-24 09:00:00.169
9f50e363-1146-4f8c-a893-a2ea405c3643	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-25 09:00:00.075
e72e3153-0c3d-444f-9b85-a09f0f6fb9ac	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-25 09:00:00.09
a6bc0d3b-fff5-46a5-8c59-76f2477e4af7	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-25 09:00:00.11
56673d8f-a202-4eee-a3a1-0fc13b06a521	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-26 09:00:00.015
746b8e18-94b7-4e75-900b-4938ee46b0b9	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-26 09:00:00.019
fe867571-0c7c-4fa6-be2f-331b7ba66ffc	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-26 09:00:00.023
fbab21a9-b56c-471b-8ed0-905a9e07ff61	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_DUE_SOON	Task Due Tomorrow	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is due tomorrow	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-02-27 09:00:00.056
813ec862-8e3a-4b17-808f-e11ed07c5f2a	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_DUE_SOON	Task Due Tomorrow	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is due tomorrow	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-02-27 09:00:00.061
eb05c54d-4417-4d08-b9d2-a709aabe6e1f	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-27 09:00:00.068
7630024a-33ce-41c4-ae01-f838311b1a44	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-27 09:00:00.072
7700f0ba-e2eb-450b-82e9-8fa41338e451	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-27 09:00:00.076
3a2f9a82-13ef-4731-b44d-bd648b2c4c7e	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_COMPLETED	Task Completed	Task "Construction Quality Tracking Process (งานซ่อมส่วนกลาง)" has been marked as completed	f	ef5179a3-452a-4cb5-b920-308926d729bc	b85e694e-de7e-420c-adaf-e1278fb46365	2026-02-27 09:54:31.197
b56e7415-d4ec-47f0-84a7-fe08c97d116b	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-02-28 09:00:00.043
a3b180f1-f676-4e5c-ba87-6729073cb591	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-02-28 09:00:00.046
669fcd9f-dac6-4147-bf93-65090eaa4029	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-02-28 09:00:00.049
47c71863-1ea1-4d66-9443-1f1f91f4108e	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-02-28 09:00:00.051
959cb659-3bc5-4031-bd9a-a9afb35872dd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-02-28 09:00:00.054
7d2a776b-85c3-46f2-ac5f-7ac42bb908d2	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-01 09:00:00.048
47866344-24c1-4264-9259-3f6025b6a1b8	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-01 09:00:00.247
e805879a-62be-4092-85eb-afc967ee6984	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-01 09:00:00.252
9d372dd7-9ac1-4601-9b2b-4d3bc8b4dc8a	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-01 09:00:00.259
6df5fbed-7636-4565-b8e9-875c422bcc6f	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-01 09:00:00.264
054db068-5a0f-4dd0-b867-1a91620f7a07	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-02 09:00:00.05
e756f3c9-f87e-4d16-82c6-c3825817f271	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-02 09:00:00.056
122dc7f4-bce5-4886-a267-adf942427aa6	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-02 09:00:00.085
8f8cf39c-02c3-40d4-a5c1-0b44b30a2d63	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-02 09:00:00.112
29f89cc4-7d8c-42d4-b437-b7d4a79a5e1e	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-02 09:00:00.251
0f9954df-d44d-482d-9899-b2b0764a9129	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-03 09:00:00.05
80416245-0cfe-4d18-bdc8-14847b3c4487	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-03 09:00:00.088
f5cacac5-9880-456a-8554-c8000a73d4c1	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-03 09:00:00.115
da8fac0f-af76-46b0-b75c-795f99dbcdb7	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-03 09:00:00.141
62143abf-b31b-460e-b26b-284b33f2c1bc	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-03 09:00:00.282
71521739-2d64-42a9-81ca-d7de9e37860f	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-04 09:00:00.019
6ac8ad5a-87af-4d1d-9057-fc4537e70616	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-04 09:00:00.037
001bcff4-5c81-4af7-a442-7ae5b56dabf6	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-04 09:00:00.05
6c9859dd-c696-475e-9f50-1be785e197c5	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-04 09:00:00.069
6424663e-9296-4e90-ab65-0b1b0e10c0ee	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-04 09:00:00.081
0a1ce983-a5c1-44f6-a296-4cd25ffee004	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-05 09:00:00.063
de83ab42-447b-455d-b205-8aadc506a1be	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-05 09:00:00.14
8f6196ea-9f9f-43cf-9400-ca0435440b47	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-05 09:00:00.144
89c5cc47-aaa7-4acf-80ed-e51356fd305c	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-05 09:00:00.148
edcb290a-52f6-4d11-afa3-29eb9af9dbf2	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-05 09:00:00.153
7288156b-18ca-4af0-a4a8-9745dce2fd2d	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-06 09:00:00.048
a170c4c9-b1c9-4280-b423-dcc101af7b94	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-06 09:00:00.053
a721feec-def1-487d-b2b0-3b33342eb0dd	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-06 09:00:00.056
df76cdbe-7d67-44fc-b477-16f2d904b131	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-06 09:00:00.06
22647534-6a6c-46a7-bb22-9b6e97553bc2	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-06 09:00:00.062
3ba1fd5e-a412-4d93-9aa7-d98512c766f8	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-07 09:00:00.045
14f879f0-490e-4e51-b9a1-0d2a12e918a3	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-07 09:00:00.079
f704eac4-4900-4067-8629-45fa7e17c1d3	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-07 09:00:00.083
a94f0fde-9275-4bd4-be8a-58a2335efd37	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-07 09:00:00.086
75c4ce76-1474-494b-920a-7054b922a2c6	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-07 09:00:00.088
a3b23fdd-aecc-4fcf-88f6-0f9a75d10296	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-08 09:00:00.048
e67cc9b9-c66d-4e0c-9a6e-a0406d298978	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-08 09:00:00.052
c6158def-6a2c-476a-a5a3-45f0a4e700fa	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-08 09:00:00.054
2b67b92b-e170-4118-9c01-a5c9c0004f72	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-08 09:00:00.057
d1b10823-c991-42e1-aab4-964905b7aa72	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-08 09:00:00.059
16c74ce8-34c6-4cfc-9da7-4a16a59286fa	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-09 09:00:00.055
47688988-4444-46a3-a282-6097137e729e	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-09 09:00:00.059
13230719-6e76-4c85-9012-03db5da57005	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-09 09:00:00.061
b86f4fec-5a01-4a50-a01e-cb9aa694c89b	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-09 09:00:00.064
4a0c49be-d584-47e8-9995-6c4fefd32a82	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-09 09:00:00.066
b7991db6-2548-4118-905d-9775e6527aae	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	TASK_ASSIGNED	Task Assigned to You	You have been assigned to task: รายงานทดสอบมูลค่าสุทธที่คราดว่าจะได้รับ 	f	456d2de7-db65-4838-b503-b2138ff63090	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	2026-03-10 03:30:15.168
6c6e2b3b-d177-41ac-8f48-f5343357dcef	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	TASK_ASSIGNED	Task Assigned to You	You have been assigned to task: รายงานแสดงตารางเปรียบเทียบสัดส่วนเหล็กต่อคอนกรีต	f	456d2de7-db65-4838-b503-b2138ff63090	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	2026-03-10 03:30:24.595
55032d60-33c0-4a96-b94e-ac8e99a4bb10	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	TASK_ASSIGNED	Task Assigned to You	You have been assigned to task: รายงานวิเคราะห์อายุสินค้าคงเหลือ	f	456d2de7-db65-4838-b503-b2138ff63090	d89e65a7-b78c-461b-a871-7f1847167f6a	2026-03-10 03:30:36.78
bcf3fe51-7738-43bd-be90-932763a42685	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	TASK_ASSIGNED	Task Assigned to You	You have been assigned to task: แบบประเมินร้านค้า 	f	456d2de7-db65-4838-b503-b2138ff63090	1c8e85d9-7a31-420a-ba50-271fca770ef1	2026-03-10 03:30:50.681
ea46511c-a4f6-4db7-aea6-fb9186ccb6ba	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	TASK_ASSIGNED	Task Assigned to You	You have been assigned to task: แบบประเมินร้านค้า 	f	456d2de7-db65-4838-b503-b2138ff63090	1c8e85d9-7a31-420a-ba50-271fca770ef1	2026-03-10 03:44:39.511
3a038645-df08-493f-b5a7-fc55baa260bd	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	TASK_ASSIGNED	Task Assigned to You	You have been assigned to task: รายงานแสดงตารางเปรียบเทียบสัดส่วนเหล็กต่อคอนกรีต	f	456d2de7-db65-4838-b503-b2138ff63090	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	2026-03-10 03:44:56.11
544b0c98-4335-465f-bed4-74888702d25c	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	TASK_ASSIGNED	Task Assigned to You	You have been assigned to task: รายงานทดสอบมูลค่าสุทธที่คราดว่าจะได้รับ 	f	456d2de7-db65-4838-b503-b2138ff63090	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	2026-03-10 03:45:04.716
55f114fb-a3cd-4d5e-b62c-b8a4b1836a51	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	TASK_ASSIGNED	Task Assigned to You	You have been assigned to task: รายงานวิเคราะห์อายุสินค้าคงเหลือ	f	456d2de7-db65-4838-b503-b2138ff63090	d89e65a7-b78c-461b-a871-7f1847167f6a	2026-03-10 03:45:10.984
e2c16cd2-f38f-4196-aa7e-3c0004b223de	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-10 09:00:00.032
eff00d85-2f12-4a0d-b25f-6b493c19acbc	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-10 09:00:00.036
26f1116d-d4bc-42bc-94c5-7b17bca01058	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-10 09:00:00.039
f9c06962-d931-4acb-9060-b5f1b4a74a51	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-10 09:00:00.043
01ce9cea-cd2d-4891-b81a-a5b894959bb4	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-10 09:00:00.047
3f828bae-fae3-4d92-980a-f90193deacb8	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-11 09:00:00.127
4b4c8acc-ad49-4780-90bd-4b434f145996	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-11 09:00:00.135
8f812fe3-9c26-4ba3-b6dc-9ce815a0a757	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-11 09:00:00.138
31cecb53-0be6-4dd0-b4c4-41acdd734226	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-11 09:00:00.141
c5e11b88-2c27-435d-a2de-dab275e42a2f	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-11 09:00:00.144
78b56e4b-e00e-41ec-bc59-27c8078ce378	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	78d0fb57-2083-491a-8259-f6a99e56383d	2026-03-12 09:00:00.259
2289df81-2cf9-4304-bc2e-5207fb88245f	978a84e2-1cf0-495a-bbba-3378c850743d	TASK_OVERDUE	Task Overdue	Task "ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"" in project "AMS - Asset Management System" is overdue	f	57a4e05c-327d-4ed2-a46d-253538838be5	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2026-03-12 09:00:00.377
cfc51152-eeeb-47fc-8901-0cd2cbac7da9	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	956cff88-71aa-4dfc-8898-a18d0f26e2f3	2026-03-12 09:00:00.403
778447b3-6e3c-4183-aa94-4ba5f0fc013c	03d7b1b4-253f-438c-8b02-ee0f689bea71	TASK_OVERDUE	Task Overdue	Task "HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)" in project "New HR System or Upgrade (New Technology)" is overdue	f	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	a15aa35d-94cc-47fb-914a-f0aafaa7bae0	2026-03-12 09:00:00.419
a138cfe8-8aa2-417e-8c12-ac435a020692	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	TASK_OVERDUE	Task Overdue	Task "Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ" in project "SENA Cashless Payment" is overdue	f	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	5454b8fe-1321-4d1d-9950-1bc2664c9606	2026-03-12 09:00:00.435
\.


--
-- Data for Name: project_members; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.project_members (id, "projectId", "userId", role, "joinedAt") FROM stdin;
863e4ae0-94e8-4bf7-b6cf-5db7d110c5fe	ef5179a3-452a-4cb5-b920-308926d729bc	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.086
31365e16-8302-4268-b82d-35533bee1dc9	ef5179a3-452a-4cb5-b920-308926d729bc	03d7b1b4-253f-438c-8b02-ee0f689bea71	MEMBER	2026-01-27 04:03:17.088
8939eb1f-d3e4-47a1-9d28-8fc1afb15774	27c3254a-19b3-41b5-85f7-306e9bfc6e35	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.089
27a33a34-c60f-49f0-9c5e-fd1c29c4ed04	27c3254a-19b3-41b5-85f7-306e9bfc6e35	9cb88436-60c7-4271-897f-40357bec5bd3	MEMBER	2026-01-27 04:03:17.089
4f9a5f72-7936-476b-b167-3dc5ffa140b0	c501785c-5e19-4ab2-8db8-387a0823e073	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.09
b4692254-bcdc-42bd-ba66-b10b678be47a	c8e404ac-934a-4a9a-85e9-007a6a2bc2a1	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.09
f8143f94-3fad-47d1-bd2f-59c1445e6eca	c8e404ac-934a-4a9a-85e9-007a6a2bc2a1	9cb88436-60c7-4271-897f-40357bec5bd3	MEMBER	2026-01-27 04:03:17.091
3c062bd4-2d16-4270-9554-8949a40a7d24	e6b9056b-f18f-48ad-a9b9-77a6b6dfbd59	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.091
278b6f87-33f0-4c6c-bcad-08e74ec51cbf	036be266-5be9-4a8e-ab38-c23c38727147	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.092
658b0732-7b59-4b44-b446-1e751aad6ce3	036be266-5be9-4a8e-ab38-c23c38727147	9cb88436-60c7-4271-897f-40357bec5bd3	MEMBER	2026-01-27 04:03:17.093
d976478f-f386-4d94-a035-2dc1c847a2de	5849dc99-79aa-4a90-b12e-de37f91b68fd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.093
323ff4fa-e7e9-464f-b5af-f5a9cf9a5766	5849dc99-79aa-4a90-b12e-de37f91b68fd	9cb88436-60c7-4271-897f-40357bec5bd3	MEMBER	2026-01-27 04:03:17.094
48d3bc6d-380c-4939-bc0c-8c063286b980	efb455e7-99d7-49bf-a2d6-2eab256e3d48	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.094
7abf837f-712d-477f-9438-df79a32a3f42	0b234b7e-df60-45b9-a2e0-b0aade0c3bf4	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.095
696289c7-67ac-4f6f-ad24-5edaaef34961	ac0b1d1b-4d60-4d57-a821-f0bc07cdf56f	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.095
654c008f-e099-4a21-98f9-cd4b1f6a30ec	ea6d076f-a136-4776-9a97-81624d476b2d	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.096
c51a5c95-7523-4cc3-b4bd-24574dc83f22	1bc7811c-cdce-40e4-b173-6f03031cca3b	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.096
93c5eb8d-b737-4016-bf38-7afb148f0766	1bc7811c-cdce-40e4-b173-6f03031cca3b	9cb88436-60c7-4271-897f-40357bec5bd3	MEMBER	2026-01-27 04:03:17.097
959c8403-da9e-4c4a-bb18-0e56bfd29635	495d99eb-cdfc-4043-ae78-591df69946a6	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.098
4431453c-517f-459c-b330-1351d602b5f7	e9487408-cfb3-41db-b47d-3f6ed81da018	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.098
8e73a0ed-a5e3-4897-a890-a71d5bfbc8f6	f673b68c-6ea8-4de9-b6f4-679aba6b2193	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.099
52b963ed-e434-47c9-bc9a-061aacecccce	225891bd-eb44-4597-81b4-d4ac4c36b301	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.099
a0edc773-75f4-4638-8723-cb92e745af93	225891bd-eb44-4597-81b4-d4ac4c36b301	9cb88436-60c7-4271-897f-40357bec5bd3	MEMBER	2026-01-27 04:03:17.099
a549d018-959a-41e9-b81a-6b7a5f983560	3d6a3782-f454-4151-a4d7-e7edb56ec078	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.1
e05a9635-ca6b-43f0-b520-17c337911d1c	3d6a3782-f454-4151-a4d7-e7edb56ec078	03d7b1b4-253f-438c-8b02-ee0f689bea71	MEMBER	2026-01-27 04:03:17.1
b8bc0d24-231f-4b7c-85a9-e9de1acf3ace	456d2de7-db65-4838-b503-b2138ff63090	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.101
2eb004a0-938f-43d1-9758-7e49495a1691	456d2de7-db65-4838-b503-b2138ff63090	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	MEMBER	2026-01-27 04:03:17.101
a06cca96-9718-406d-9922-f20b6f79653a	456d2de7-db65-4838-b503-b2138ff63090	9cb88436-60c7-4271-897f-40357bec5bd3	MEMBER	2026-01-27 04:03:17.102
b2bf152e-c8eb-46bc-a1fe-9db8c6b7e616	4962b4f9-eea0-443f-96e0-a7d8ede2aaab	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.103
461acac7-bf63-441f-b4d6-3fc9854ea5d8	a2b3999b-67e6-4ee4-ac84-53e9c55b9a50	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.103
98e5e3bf-46e6-47bf-9ef5-22ace12d9bf0	81d95785-7416-4530-aecb-46e93376d356	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.104
3ed1f467-161f-4df8-a341-aae7cd508b04	a99c7383-2491-41f7-bf33-439aa9814c96	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.105
6fb40f60-5f74-4b6b-8dea-94885b5e9b56	e0f83878-68cb-41d1-8702-0f1b6c483f73	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.106
082454cb-7145-4c1d-85da-cd3ba1fb1fb6	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.106
3f60d207-1ccb-460f-9896-1d0f2e806482	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-01-27 04:03:17.107
bdd03cd6-0cce-4595-8e61-6def7734e859	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	03d7b1b4-253f-438c-8b02-ee0f689bea71	MEMBER	2026-01-27 04:03:17.107
f3c38914-4c52-4d68-99a6-22b65e1c5109	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	OWNER	2026-02-16 06:28:37.017
ae639ebd-5393-48da-b34b-6b6232a8ce0c	3befac94-54d4-4e5d-935f-b35949157fe9	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	OWNER	2026-02-16 07:10:56.832
bf0f5a0e-c778-41cc-ac8d-90ef10fd3777	36163cb1-a30d-4436-99c7-5f9f25f3c0ed	978a84e2-1cf0-495a-bbba-3378c850743d	OWNER	2026-02-26 11:01:42.626
04c55493-2fee-44e8-8630-7177553e0dd3	36163cb1-a30d-4436-99c7-5f9f25f3c0ed	2b56085f-5933-46ce-8005-74a7088e301a	MEMBER	2026-02-26 11:01:42.643
a7dc53d9-505c-44a6-a7e6-7ada738da095	57a4e05c-327d-4ed2-a46d-253538838be5	978a84e2-1cf0-495a-bbba-3378c850743d	OWNER	2026-02-26 11:01:42.729
02c77f26-6e91-4972-b903-c981fe5dd9dc	57a4e05c-327d-4ed2-a46d-253538838be5	2b56085f-5933-46ce-8005-74a7088e301a	MEMBER	2026-02-26 11:01:42.746
bb41709d-f3e6-4767-9c09-a238111e6647	de992991-0fa6-4556-8417-1b3110ed4123	978a84e2-1cf0-495a-bbba-3378c850743d	OWNER	2026-02-26 11:01:43.072
86cacd09-ca59-4d92-8e02-bd1a92867038	de992991-0fa6-4556-8417-1b3110ed4123	2b56085f-5933-46ce-8005-74a7088e301a	MEMBER	2026-02-26 11:01:43.088
6a0c8a09-4e26-4509-8b03-cfc049e6d863	456d2de7-db65-4838-b503-b2138ff63090	c8bbd6df-cd0f-4b5a-8364-b052d8171595	MEMBER	2026-03-10 02:34:33.715
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.projects (id, name, description, color, icon, status, "startDate", "endDate", "projectCode", category, "businessOwner", "sortOrder", timeline, "ownerId", "createdAt", "updatedAt") FROM stdin;
456d2de7-db65-4838-b503-b2138ff63090	CMS-POJJAMAN 2026	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-02-00	CONSTRUCTION_OPERATION	\N	2	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.401	2026-02-14 20:02:59.416
efb455e7-99d7-49bf-a2d6-2eab256e3d48	Referral - RentNex,LivNex	Project ID: PP26000-00-00	#1890ff	\N	DELAY	\N	\N	PP26000-11-00	SALES_MARKETING	\N	11	{"2026": {"4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.379	2026-02-14 20:02:59.417
81d95785-7416-4530-aecb-46e93376d356	Corporate OKR System	Project ID: PP26000-00-00	#1890ff	\N	COMPLETED	\N	\N	PP26000-17-00	CORPORATE	\N	17	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.41	2026-02-14 20:02:59.425
1bc7811c-cdce-40e4-b173-6f03031cca3b	E-Contract	Project ID: PP26000-00-00	#EC4899	\N	DELAY	2026-01-31 17:00:00	2026-02-27 17:00:00	PP26000-15-00	SALES_MARKETING	\N	15	{"2026": {"7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.389	2026-02-15 07:56:07.769
27c3254a-19b3-41b5-85f7-306e9bfc6e35	CDP/CRM 2025 (Leads Tracking (Online/Offline/Chat))	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-05-00	SALES_MARKETING	\N	5	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.366	2026-02-14 20:02:59.389
ef5179a3-452a-4cb5-b920-308926d729bc	SENA SiteMaps (Masterplan) 2026(V2)	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-01-00	CONSTRUCTION_OPERATION	\N	1	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.356	2026-02-14 20:02:59.384
c501785c-5e19-4ab2-8db8-387a0823e073	Meta CAPI Gateway	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-06-00	SALES_MARKETING	\N	6	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.368	2026-02-14 20:02:59.391
c8e404ac-934a-4a9a-85e9-007a6a2bc2a1	Booking-to-Transfer Tracking  (Integrate กับ REM,LivNex,RentNex,  Sitemaps,Fast Inspect) รองรับวงจรประสิทธิภาพ 30 วัน	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-07-00	SALES_MARKETING	\N	7	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.369	2026-02-14 20:02:59.392
e6b9056b-f18f-48ad-a9b9-77a6b6dfbd59	Sales-Bot (สำหรับช่วยทำงานเก็บข้อมูลใน LineGroup  ที่มีการคุยกับธนาคาร)	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-08-00	SALES_MARKETING	\N	8	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.373	2026-02-14 20:02:59.393
036be266-5be9-4a8e-ab38-c23c38727147	Pricing Management  , Audit with AI	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-09-00	SALES_MARKETING	\N	9	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.374	2026-02-14 20:02:59.395
0b234b7e-df60-45b9-a2e0-b0aade0c3bf4	Sales-Kit + AI	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-12-00	SALES_MARKETING	\N	12	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.381	2026-02-14 20:02:59.396
495d99eb-cdfc-4043-ae78-591df69946a6	SenProp Improvement 2025	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-24-00	PRODUCT	\N	24	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.391	2026-02-14 20:02:59.399
f673b68c-6ea8-4de9-b6f4-679aba6b2193	SENA RentNex Application	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-23-00	PRODUCT	\N	23	{"2026": {"4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.396	2026-02-14 20:02:59.403
a99c7383-2491-41f7-bf33-439aa9814c96	SenX Complain Management and Analysis with AI	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-26-00	CUSTOMER_SERVICE	\N	26	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.413	2026-02-14 20:02:59.409
e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	Smartify-Backend (สร้างระบบทดแทนการใช้ Google Appsheet)	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-28-00	CUSTOMER_SERVICE	\N	28	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.417	2026-02-14 20:02:59.412
e9487408-cfb3-41db-b47d-3f6ed81da018	SENA 360 Revamp2025	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-22-00	PRODUCT	\N	22	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.393	2026-02-14 20:02:59.401
4962b4f9-eea0-443f-96e0-a7d8ede2aaab	SENA AI Automation	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-29-00	CUSTOMER_SERVICE	\N	29	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.405	2026-02-14 20:02:59.405
a2b3999b-67e6-4ee4-ac84-53e9c55b9a50	ระบบบริหารห้องเช่าสำหรับ SENA Fast - Improvement 2026	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-25-00	PRODUCT	\N	25	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.409	2026-02-14 20:02:59.407
e0f83878-68cb-41d1-8702-0f1b6c483f73	SenX-Bot (สำหรับช่วยทำงานเก็บข้อมูลใน LineGroup  ที่มีการคุยกัน)	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-27-00	CUSTOMER_SERVICE	\N	27	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.416	2026-02-14 20:02:59.41
a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	New HR System or Upgrade (New Technology)	Project ID: PP24002-00-00	#1890ff	\N	DELAY	2026-01-31 17:00:00	2026-03-30 17:00:00	PP26000-18-00	CORPORATE	\N	18	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.419	2026-02-14 20:02:59.414
3d6a3782-f454-4151-a4d7-e7edb56ec078	Product Single View	Project ID: PP26000-00-00	#1890ff	\N	DELAY	\N	\N	PP26000-21-00	PRODUCT	\N	21	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.4	2026-02-14 20:02:59.418
5849dc99-79aa-4a90-b12e-de37f91b68fd	REM LivNex/RentNex Improvement 2026	Project ID: PP26000-00-00	#1890ff	\N	HOLD	\N	\N	PP26000-10-00	SALES_MARKETING	\N	10	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.377	2026-02-14 20:02:59.42
ac0b1d1b-4d60-4d57-a821-f0bc07cdf56f	REM Improvement	Project ID: PP26000-00-00	#1890ff	\N	ACTIVE	\N	\N	PP26000-13-00	SALES_MARKETING	\N	13	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.383	2026-02-14 20:02:59.426
225891bd-eb44-4597-81b4-d4ac4c36b301	Master Customer Profiles & Customer Single View	Project ID: PP26000-00-00	#1890ff	\N	COMPLETED	2026-01-31 17:00:00	2026-02-27 17:00:00	PP26000-16-00	SALES_MARKETING	\N	16	{"2026": {"1": "planned", "2": "planned", "3": "planned", "4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.398	2026-02-15 10:19:30.118
ee867f39-fdbb-48af-9abd-e48c7dcf0d43	SENA Cashless Payment	Project SENA เพื่อการรับชำระ แบบไร้เงินสด\nแบ่งออกเป็น 3 Phase\nStage 1  : การใช้งาน EDC สำหรับการรับชำระทุกโครงการ\nStage 2 : การใช้ Payment Gateway Technology เพื่อการรับชำระ ทุกกิจกรรมในงานขาย / งานบริการ	#F59E0B	\N	ACTIVE	2025-12-31 17:00:00	2026-09-29 17:00:00	\N	\N	\N	0	\N	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-16 06:28:37.017	2026-02-16 06:28:37.017
ea6d076f-a136-4776-9a97-81624d476b2d	SENA Cashless Journey	Project ID: PP26000-00-00\nสำหรับ Flow Jouney - Full Chashless Society \nProject SENA เพื่อการรับชำระ แบบไร้เงินสด แบ่งออกเป็น 3 Phase Stage 1 : การใช้งาน EDC สำหรับการรับชำระทุกโครงการ Stage 2 : การใช้ Payment Gateway Technology เพื่อการรับชำระ ทุกกิจกรรมในงานขาย / งาน\nStage 3 : Intregrated กับ ระบบ Application	#1890ff	\N	ACTIVE	2025-12-31 17:00:00	2026-12-30 17:00:00	PP26000-14-00	SALES_MARKETING	\N	14	{"2026": {"4": "planned", "5": "planned", "6": "planned", "7": "planned", "8": "planned", "9": "planned", "10": "planned", "11": "planned", "12": "planned"}}	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-01-27 02:13:21.388	2026-02-16 06:48:49.466
3befac94-54d4-4e5d-935f-b35949157fe9	ระบบรับ-ขาย วัสดุก่อสร้างโกดังพัฒนาการ 25 (คลังเอชาย) Phase I รายงาน Change 26/01/2569 กับพี่วี	\N	#3B82F6	\N	ACTIVE	2026-01-04 17:00:00	2026-03-30 17:00:00	\N	\N	\N	0	\N	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-16 07:10:56.832	2026-02-16 07:11:42.122
36163cb1-a30d-4436-99c7-5f9f25f3c0ed	CMS - Construction Material System	CMS tasks imported from JO Excel	#F59E0B	\N	ACTIVE	\N	\N	PP26000-30-00	SOFTWARE_DEVELOPMENT	\N	30	\N	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:42.566	2026-02-26 11:01:42.566
57a4e05c-327d-4ed2-a46d-253538838be5	AMS - Asset Management System	AMS tasks imported from JO Excel	#3B82F6	\N	ACTIVE	\N	\N	PP26000-31-00	SOFTWARE_DEVELOPMENT	\N	31	\N	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:42.71	2026-02-26 11:01:42.71
de992991-0fa6-4556-8417-1b3110ed4123	SF - Salesforce Integration	SF tasks imported from JO Excel	#10B981	\N	ACTIVE	\N	\N	PP26000-32-00	SOFTWARE_DEVELOPMENT	\N	32	\N	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:43.056	2026-02-26 11:01:43.056
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.refresh_tokens (id, token, "userId", "expiresAt", "createdAt") FROM stdin;
b503591e-e89a-4646-8821-903b63d09b14	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MDk2ODI0NSwiZXhwIjoxNzcxNTczMDQ1fQ.A-J8n8wWLtRnjxyEiLU3m2zSKlpbAyduNNlTAnFu23s	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-20 07:37:25.824	2026-02-13 07:37:25.825
4be0599a-8ed1-4b46-b53b-57bb5e92a671	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MDk2ODMzMSwiZXhwIjoxNzcxNTczMTMxfQ.Er3n6MYI1IR5nHRRCmZskPYUcSkyxisFgoSDML85BRY	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-20 07:38:51.172	2026-02-13 07:38:51.172
3773f0a2-ab61-449b-85fd-b0d733ccfc1a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MDk2ODUzNSwiZXhwIjoxNzcxNTczMzM1fQ.fgRRMVslA8sZBXpbyhzXJQCdellhrJwo2PoOrfrlfyU	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-20 07:42:15.025	2026-02-13 07:42:15.026
8ee8c2c4-a655-4d14-abfa-ff93ef0a9fc8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MDk2ODU0NiwiZXhwIjoxNzcxNTczMzQ2fQ.bQAqZBfAMW975TX53aX8Ng3gNxLpEJVzK-eCY9crPz8	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-20 07:42:26.498	2026-02-13 07:42:26.498
0edeec43-df79-4c94-b95a-48eac62ff85e	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MDk2ODYxMiwiZXhwIjoxNzcxNTczNDEyfQ.2BkSBSPIL1eTf7EYzDnuWh90M2IHwmQ2RjbfKMS--yQ	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-20 07:43:32.034	2026-02-13 07:43:32.034
3740d2cd-2a38-4a1a-994d-c98fb6767963	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MDk2ODc4OSwiZXhwIjoxNzcxNTczNTg5fQ.2M7n9p3qEITV82GpRtIZASIbNWFzn6L5ULsICKsoXQs	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-20 07:46:29.41	2026-02-13 07:46:29.41
7e6625ea-6047-4840-9193-30f3381a369a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MDk3Mzk1MSwiZXhwIjoxNzcxNTc4NzUxfQ.36c5zK9D3adF0fhhSYLWtqXw0_NN3BlBjugwRc6xTZM	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-20 09:12:31.667	2026-02-13 09:12:31.668
2d950135-3e5d-45c4-a0fd-1e9cf2a45b07	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTA1NDEyMCwiZXhwIjoxNzcxNjU4OTIwfQ.kXuXetmE30Hm64ylaXCHg3EudMNM6WEZ5zHFy27sp1w	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-21 07:28:40.271	2026-02-14 07:28:40.271
a1b8ea05-5d93-436a-a090-56882c052f5a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTA1NTAwNywiZXhwIjoxNzcxNjU5ODA3fQ.-8gF6BzFMg5mgEMcYsyktKtx0gelbQCGLqAWXdki3vU	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-21 07:43:27.189	2026-02-14 07:43:27.189
60788c40-25b4-4981-81dc-14dcd6f710e9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTA5MzIyMywiZXhwIjoxNzcxNjk4MDIzfQ.-O9EkqoraHWaXIrZmopmQUvR8McfHn2m1XdLLGKuIjw	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-21 18:20:23.302	2026-02-14 18:20:23.302
6d9dfad6-1c02-4878-84cb-409ed2e957a9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTA5NjkxNSwiZXhwIjoxNzcxNzAxNzE1fQ._1idJYis96YxFOhw9tzqpUJvYppW5tOyn9hTCI-muSQ	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-21 19:21:55.627	2026-02-14 19:21:55.627
b8269052-088e-456e-a0a4-734fee11c2c1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTA5Njk0NiwiZXhwIjoxNzcxNzAxNzQ2fQ.rjlC0gPqjGHvB1mni6pLf_eHohNCbLvgzMhx5o_XZv8	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-21 19:22:26.769	2026-02-14 19:22:26.77
e12a85e2-cbee-4d66-9e77-a355422cf01b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTA5NzAyMSwiZXhwIjoxNzcxNzAxODIxfQ.pR3KkJDgWmrv67HASMftcg6abQa5GAG5n8hBGu_9g2o	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-21 19:23:41.911	2026-02-14 19:23:41.912
caec45f1-269a-4e60-8e9b-aea455a9e96f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTA5OTQ3MCwiZXhwIjoxNzcxNzA0MjcwfQ.iV1nPVJjt9qoDFuWIgiDdKWfE4uyoXUPgbs-1tRGEeg	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-21 20:04:30.003	2026-02-14 20:04:30.004
3f95fcf4-ef32-4326-9d5f-d42780bf58fa	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTA5OTQ4MywiZXhwIjoxNzcxNzA0MjgzfQ.B92SDC_ojereo5rJoAIJDzWLsW2b9lYLCUMNJpudtt8	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-21 20:04:43.565	2026-02-14 20:04:43.566
25d09417-716f-40e8-9777-888144761ac4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTA5OTUwOSwiZXhwIjoxNzcxNzA0MzA5fQ.CX634if7KFiOkqaLooXb8eZyfN4MhcdneLLiJIOS_Io	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-21 20:05:09.552	2026-02-14 20:05:09.553
2351aced-cbdd-4c69-a44b-832a15e97ffe	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTA5OTgyNCwiZXhwIjoxNzcxNzA0NjI0fQ.rBooAV_vxMEyw339iMspuJQb1x7mAw9F9Q_OfPwSkZ0	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-21 20:10:24.173	2026-02-14 20:10:24.173
2f897568-7033-4dff-8d63-a0f4970026f0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTEzMjE5MCwiZXhwIjoxNzcxNzM2OTkwfQ.vvthfCPyxuBY2J85ARY-7PrJhDHZSzCR4k97MPqTXtc	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-22 05:09:50.319	2026-02-15 05:09:50.32
cf5116f3-02f1-4f67-9261-4a0da2f47656	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzMjIwMiwiZXhwIjoxNzcxNzM3MDAyfQ.16KGTQiWTym0ekKduSDZmAyqiDxZB-Jwky-BUbunAVM	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 05:10:02.695	2026-02-15 05:10:02.695
190e8863-fd01-49b2-9d15-466ee4b504c3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzMjc1MiwiZXhwIjoxNzcxNzM3NTUyfQ.sKNQWqaK5sodJE6KHld3CrFSrGR4b651HBmIpOYExns	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 05:19:12.213	2026-02-15 05:19:12.214
de4f269e-60db-49d3-99b7-46e60ced8de8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzMjg1OSwiZXhwIjoxNzcxNzM3NjU5fQ.lagtjpHaKVuayLSqplAc28LCfEs8O3BlxFaVDCk9HhU	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 05:20:59.446	2026-02-15 05:20:59.447
c3ce12b3-14a4-430a-b82f-df040d2caea2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzMjkxMSwiZXhwIjoxNzcxNzM3NzExfQ.FNU7jy1c9gCo_AmzNulbBgLtzRUSrpjfsoWK4I1CMKU	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 05:21:51.379	2026-02-15 05:21:51.38
ae9b9dd5-bf73-47ac-8e69-533efa69b424	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzMjkzMiwiZXhwIjoxNzcxNzM3NzMyfQ.vebk4fVcE0wJjWjWCA1-T4LpOOQ0kRs65piDehd3JTk	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 05:22:12.304	2026-02-15 05:22:12.305
3d2c1c28-c696-4253-8800-29b152485bfa	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzMzAwMiwiZXhwIjoxNzcxNzM3ODAyfQ.LxzYP_fIsPl7O2rmAsWGmKQxIArGceBH_zI-GJdYJ2M	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 05:23:22.964	2026-02-15 05:23:22.965
fe7445f2-ff19-4bb5-9727-c95c09b126a2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzMzI3NSwiZXhwIjoxNzcxNzM4MDc1fQ.IKGu1gUIA6tGNoZGMC36SHjbcYp6TQqgOalrjCyb7ss	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 05:27:55.606	2026-02-15 05:27:55.607
e4deb1fb-f87f-43ef-9b3c-2e3108db6892	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzMzg5NiwiZXhwIjoxNzcxNzM4Njk2fQ.5cHP8wewA4S4PDl5uz0Xemkl-CLAkexHR2iCEeFNDgc	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 05:38:16.645	2026-02-15 05:38:16.646
668d8593-52ab-4109-abcb-f2ef8d338c31	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwY2E4NjRjLTcyOWQtNDFhMi04MGNiLWE3NjI2MTJiNzcxOSIsImlhdCI6MTc3MTEzMzk2OCwiZXhwIjoxNzcxNzM4NzY4fQ.fzfvZ7iUUSiArE2Xze9jJi1_RHzsiEFajkFuTI1vdnY	50ca864c-729d-41a2-80cb-a762612b7719	2026-02-22 05:39:28.296	2026-02-15 05:39:28.296
04f670f4-3120-4d3b-9774-a1a28ad09200	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzNDM2MiwiZXhwIjoxNzcxNzM5MTYyfQ.U2MulCydAzsoDgohFtndJ0ijltk3t3-781lNc6azPnU	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 05:46:02.452	2026-02-15 05:46:02.453
08f873f0-fd0b-4b8f-9f28-90221694f444	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzNjEyMywiZXhwIjoxNzcxNzQwOTIzfQ.oAcqakEcnJZHwiB41ptV7PRxmjdbtJIkEs2oFv6tHHQ	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 06:15:23.08	2026-02-15 06:15:23.08
9f114e4f-d251-4c8d-8dd3-10b20c9af8f7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTEzODkwNiwiZXhwIjoxNzcxNzQzNzA2fQ.Cfu811IvHlcGRagYVdtWHsxV8ZNWPJFq1gpX85o3ogg	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 07:01:46.028	2026-02-15 07:01:46.028
ff38d8fb-6903-4041-bfd8-7182acde32d5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTE1MjEyOCwiZXhwIjoxNzcxNzU2OTI4fQ.O0eh0pl2gtXHkYrVoVcR5qZwUz-Ed9lmbBrZbqaI5Y4	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-22 10:42:08.171	2026-02-15 10:42:08.171
e6f1e25a-f097-44e5-a7d5-95a08c7b3ab3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTE1NjM4OSwiZXhwIjoxNzcxNzYxMTg5fQ.xPWRG9d4DqxC6R90JlM8g7f3lHQAQkKn1huvCdRQzhc	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-22 11:53:09.908	2026-02-15 11:53:09.909
d4a4a7f2-76fa-4a3a-8f19-e37ab1b8f3e3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTE1NzM4MSwiZXhwIjoxNzcxNzYyMTgxfQ.Cw831V0LlOj3UlY-ZK694ZH0oS7XOr4ENRCuL20ottE	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-22 12:09:41.021	2026-02-15 12:09:41.022
44f5a089-3b71-43c1-a35f-7f13febfea15	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTIxMDM3NywiZXhwIjoxNzcxODE1MTc3fQ._oAItMlyRDl7q2Jn-jcgLaAR1LDmaVON1XU3XM0wXmk	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-23 02:52:57.487	2026-02-16 02:52:57.488
c9090053-3504-4cfa-a2ef-4e1dec809764	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIxMjA0OSwiZXhwIjoxNzcxODE2ODQ5fQ.-h0u-IvveP1CMGD1KyMZAc81TPKZXWPTb5r19bRiLzA	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 03:20:49.502	2026-02-16 03:20:49.503
5fc88d8b-cb66-45c4-ad41-bc3559925d97	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIxMjEyNCwiZXhwIjoxNzcxODE2OTI0fQ.k99lFNDHRVD3oZhjxrRta0Nrhur43iiCDQcHGM47yAE	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 03:22:04.61	2026-02-16 03:22:04.611
d6ef6e84-5717-40dc-b099-ad1dabc15d12	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIxNjIyOCwiZXhwIjoxNzcxODIxMDI4fQ.tu69-VRI9Bn1bzPHCXBRiAqU0TuCn1PcsSjMe6MqUKk	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 04:30:28.888	2026-02-16 04:30:28.888
a49e03fa-0058-4862-8daf-a6b1eec12482	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIxNjk0OCwiZXhwIjoxNzcxODIxNzQ4fQ.SW145GqlEGRGTSpKTb0cXIv7AdyQQj1IVP2sqqltO3c	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 04:42:28.364	2026-02-16 04:42:28.365
fd8ad2ca-2d77-4273-a303-a43201bae0d3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIxODQ0MSwiZXhwIjoxNzcxODIzMjQxfQ.Z1OYgHLf_c59KnKhPTOecjRe_lh67oASco55rJrt4ZI	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 05:07:21.578	2026-02-16 05:07:21.579
da2b5be9-9609-4de8-bfb6-bf53ce4d0cf3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjYjU5MWIxLTRlMWItNDJhMi1hOWNiLWVlNDI2Y2FiY2EwYSIsImlhdCI6MTc3MTIxODYwMCwiZXhwIjoxNzcxODIzNDAwfQ.-REeHIz7LX1RifZZm-3s40fFgJJVD4vjVgh9vmZemdw	ecb591b1-4e1b-42a2-a9cb-ee426cabca0a	2026-02-23 05:10:00.804	2026-02-16 05:10:00.805
101da6fc-80c8-46cf-9b89-6c7b16c85ccf	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTIxODg3OSwiZXhwIjoxNzcxODIzNjc5fQ.f9i4tLIsN1IFe3Cfz0Z-5MAogqGV-EGvGWb8RzgBHaU	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-23 05:14:39.398	2026-02-16 05:14:39.399
662ef350-59b5-4163-9c07-45431721809b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MTIyMjU1NiwiZXhwIjoxNzcxODI3MzU2fQ.CiVLvx0C_enCiwOtvAOp3BiE7hwTE0p3GEaqur1WjLk	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-23 06:15:56.279	2026-02-16 06:15:56.28
7dba9838-c1a9-455a-9b1a-4e2045170ee4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIyMjkwOSwiZXhwIjoxNzcxODI3NzA5fQ.q04W-QR_9FK7Za6r59AE2Zom5YFpINZUGxGCwYj_h94	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 06:21:49.734	2026-02-16 06:21:49.735
e522de94-692e-4b09-a20e-e9ef5125c7bc	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3OGE4NGUyLTFjZjAtNDk1YS1iYmJhLTMzNzhjODUwNzQzZCIsImlhdCI6MTc3MTIyMjk3MSwiZXhwIjoxNzcxODI3NzcxfQ.RntRdm2mvra3Y8EVffg8fp2lQQTjo11BaYhq1_HK1Wg	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-23 06:22:51.107	2026-02-16 06:22:51.108
47b4ca31-b794-4fe4-afc5-f05be125e8e0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIyMzA3NywiZXhwIjoxNzcxODI3ODc3fQ.pjuXIu4RFuOyOPiPVx2QLwzrymzhN92xbG2nZ0-ZFqI	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 06:24:37.988	2026-02-16 06:24:37.989
fb060c49-b10a-4a72-acb5-0b51e172b212	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIyOTgwMSwiZXhwIjoxNzcxODM0NjAxfQ.WzIE4Jm8CZ1Tr6_tmxEPuQjoh5SfflxFAqku6YmA5EA	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 08:16:41.345	2026-02-16 08:16:41.346
02b3cbcf-7b3b-4f15-9b4d-e44f78c5e8b4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIyOTg3NywiZXhwIjoxNzcxODM0Njc3fQ.geRyOWm2goblpKJymri9tbFMzWU1UntcvJ-7BmWQRBU	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 08:17:57.102	2026-02-16 08:17:57.103
0f48d805-8e57-4df0-8070-2f49b2c46238	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIzMTMxNSwiZXhwIjoxNzcxODM2MTE1fQ.6rGmror_3vUKRShAeYDUt5jYeHWClXXFG_kBo-97F-k	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 08:41:55.427	2026-02-16 08:41:55.428
44fa372d-9fc4-4147-8813-b22cf67c1c07	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MTIzMTMzNywiZXhwIjoxNzcxODM2MTM3fQ.qw468X6iyBfDt6rQgFLmyBd2d1SFMdycgxhD13BHoJE	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-02-23 08:42:17.179	2026-02-16 08:42:17.18
77f28aee-7cda-4647-9af0-1c2591e81a6e	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MjA4OTQ0NCwiZXhwIjoxNzcyNjk0MjQ0fQ.v8uJ6hh5vW-Fvy3HRqL0ML-UzuDn1sdnLxiL6x55bE8	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-03-05 07:04:04.303	2026-02-26 07:04:04.304
0023baa1-7b4c-42a6-b8cb-31a53cc4f900	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjA4OTgxNSwiZXhwIjoxNzcyNjk0NjE1fQ.8esWhgbknZzjssXf9LqS5sp0UXxVZXcXKFvUgsH7Ffo	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 07:10:15.845	2026-02-26 07:10:15.846
91446c87-625a-4328-946f-8ac4eb49e69e	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MjA4OTgyNiwiZXhwIjoxNzcyNjk0NjI2fQ.lnrE5ypLAE95oFA3JX8sHCSNNWUMSFo1TDNJkbHi1uM	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-03-05 07:10:26.844	2026-02-26 07:10:26.845
b5614253-a6c1-4839-9703-c1fb3c0dac2d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjA4OTkxNywiZXhwIjoxNzcyNjk0NzE3fQ.sSSzdusjloP7XSJoMtHbqXMJmtu4EAX03He0wvuF2lM	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 07:11:57.848	2026-02-26 07:11:57.849
86d056de-626f-4ee6-bfa5-4d678e3ffd83	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjA5MDEwMywiZXhwIjoxNzcyNjk0OTAzfQ.L0MAl1av-PuRE2O3xuA21o6txb7luht6Bil1gDWSZys	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 07:15:03.241	2026-02-26 07:15:03.242
6988d378-9b42-4edf-8a0c-51d85b4fc059	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjA5MDQ1NSwiZXhwIjoxNzcyNjk1MjU1fQ.nDsADqmW_Cuopwodp75Su7RbFvwI8_yxFZHLTZtQwZU	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 07:20:55.719	2026-02-26 07:20:55.72
5f8cc4e4-11aa-49ab-a754-8f45f3ced957	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjA5MjEzMSwiZXhwIjoxNzcyNjk2OTMxfQ.p23YzX2By4VM1An2fWqChBLcRA3Pv9M0F8mw7aCyRCo	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 07:48:51.839	2026-02-26 07:48:51.839
d42a99c4-b7d6-4163-b9fc-f76cba47c47e	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4YmJkNmRmLWNkMGYtNGI1YS04MzY0LWIwNTJkODE3MTU5NSIsImlhdCI6MTc3MjA5MjE3MiwiZXhwIjoxNzcyNjk2OTcyfQ.Sw2HqCFt7vPLYi6lIEv-P1Ufk46J_Y0pxtcfuarvpCk	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-05 07:49:32.188	2026-02-26 07:49:32.189
ea66eab8-e731-4463-90e3-4c35fd215dd4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjA5MjIxMywiZXhwIjoxNzcyNjk3MDEzfQ.GyLk5LlzgmhYQKPN2yOzno5Xh6Ku-B7mU2kbu21c7tw	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 07:50:13.449	2026-02-26 07:50:13.45
7dc3ac38-3f66-4583-a45b-737d833a24ed	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjA5NDE4MCwiZXhwIjoxNzcyNjk4OTgwfQ.oiLe4yPAAuifbrjkOrIPETTsVNJmctrlnyOdxS3ryIc	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 08:23:00.723	2026-02-26 08:23:00.723
82817ad2-0bb2-4016-915a-e4b5755bb2b0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjA5NTgxNSwiZXhwIjoxNzcyNzAwNjE1fQ.4n7Z3WYvF1S0sqHOq2rRbotcl05wLgq90N6Jfc19ufw	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 08:50:15.305	2026-02-26 08:50:15.306
6b0bea5d-63e2-4ae4-8cb6-544dc741696b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MjA5NjEyNywiZXhwIjoxNzcyNzAwOTI3fQ.ijGqT_eqydvSf6NJgf5CeB3KDFb7ELUKIpyIqR3m0lA	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-03-05 08:55:27.916	2026-02-26 08:55:27.917
039b3eb4-0f90-432b-af05-54bfc9e094b6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjEwMzc2MCwiZXhwIjoxNzcyNzA4NTYwfQ.0x4OJH6EG0I79pPkVzkLIkwZUgVoomR43dVaM1iEzqs	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 11:02:40.352	2026-02-26 11:02:40.352
1bc17197-0a5d-4179-bff3-783d2fc96047	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjEwMzkxMSwiZXhwIjoxNzcyNzA4NzExfQ.x7Z9FSxYVRONCbEtpCrk05ByoNDEwFW5GSrzZKa6tus	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-05 11:05:11.472	2026-02-26 11:05:11.473
61a9cf47-5843-45d8-86c8-792117e3e668	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjE1NzQ4NiwiZXhwIjoxNzcyNzYyMjg2fQ.83LQQK46D_YohnL3LMWr_FVeJ7kTUDRPHXJHZjbQc2o	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-06 01:58:06.621	2026-02-27 01:58:06.621
ce552b33-77e8-4b3f-a35a-731071d8c591	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjE4NTk2NSwiZXhwIjoxNzcyNzkwNzY1fQ.z0lxMAIA2dOlNKmRciG65Le1tg8tRAL6bgOP6yfhUkQ	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-06 09:52:45.454	2026-02-27 09:52:45.454
ed223f5d-2bcc-402d-b686-fb02c719a473	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MjE4NjIyMSwiZXhwIjoxNzcyNzkxMDIxfQ.WRyZJiRloQX9eamFKKrZJJ9IeRyb1HyFrEc4PAXi6co	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-03-06 09:57:01.499	2026-02-27 09:57:01.5
6610dee0-2015-4e07-ba99-e6af66efe672	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MjQyMzM4NSwiZXhwIjoxNzczMDI4MTg1fQ.SuZv8cqIlNIPhz9g4G4fu5mNBE1rHWEi_6eKWzCxVzw	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-03-09 03:49:45.721	2026-03-02 03:49:45.722
fac56889-2fb7-4def-b5a3-1a08317002ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YWNjN2ZkLWM1YzAtNDMxMC04NTJlLWI1ZWU1ZjRlNGFmZCIsImlhdCI6MTc3MjQyMzgyMywiZXhwIjoxNzczMDI4NjIzfQ.HmJSY7k6iO5CU1wpC4CFllPRUmEZZpdL5SZqq-dhC6s	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-03-09 03:57:03.646	2026-03-02 03:57:03.647
eda87b15-2182-42af-abe3-396138bca5fd	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjQyMzgyNywiZXhwIjoxNzczMDI4NjI3fQ.dhgxgCKSwsbl7C5E085szF0cTi5he1-nTodECTTib2Q	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-09 03:57:07.666	2026-03-02 03:57:07.667
077795ff-51d7-4442-b40f-8c9b7a9fcf46	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjQyMzg0MSwiZXhwIjoxNzczMDI4NjQxfQ.i0RzAFVnepAYkYOguzkid0KVkkPGG4U-ryMLDDQMH_4	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-09 03:57:21.407	2026-03-02 03:57:21.408
1ae9e5b9-b5c4-49f9-89ed-ca1a34068701	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjQyMzk4NSwiZXhwIjoxNzczMDI4Nzg1fQ.RIOAGgCaK2nQICUPp5JnNd3fQ8we7en-xSZ92udiAzc	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-09 03:59:45.381	2026-03-02 03:59:45.382
1e2a79f1-00e9-4bdf-8ef3-e69825a9e5e4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVkNWMyNjkwLTI4Y2ItNDk0Mi04ZjRmLWZhNDgyMDM4YjFhZiIsImlhdCI6MTc3MjQyNDAyOSwiZXhwIjoxNzczMDI4ODI5fQ.HAr07WUW_xnPNpFNu0P9vbE5ZS0dMDi-QEiyRVcrbYs	ed5c2690-28cb-4942-8f4f-fa482038b1af	2026-03-09 04:00:29.122	2026-03-02 04:00:29.122
93bdc42c-f116-4b93-aef2-7c4df068dfcd	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjQ0MzUxOCwiZXhwIjoxNzczMDQ4MzE4fQ.FYEQPGQ92lpbYisYVEKiLMGT7pFEcjZY4StE2O3O8-0	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-09 09:25:18.239	2026-03-02 09:25:18.24
7251b53e-11f9-4f3d-9ffd-c01af3626ff6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjU5MjM5NSwiZXhwIjoxNzczMTk3MTk1fQ.LjF1GV3YIuYzMIVXLQyIzc6OaHxrp0ajCj2PiMY2dbM	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-11 02:46:35.368	2026-03-04 02:46:35.369
83e82509-5aa6-4627-b27d-4e9fb60faeaa	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjU5MzA1NywiZXhwIjoxNzczMTk3ODU3fQ.Cpk6P53f5OSNDAjS2-1whwO6QUwbUz6HhM4kSnlP4oc	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-11 02:57:37.784	2026-03-04 02:57:37.785
e3f12933-1d79-4548-ad29-9ebc607a262a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4YmJkNmRmLWNkMGYtNGI1YS04MzY0LWIwNTJkODE3MTU5NSIsImlhdCI6MTc3MjU5NzUxNCwiZXhwIjoxNzczMjAyMzE0fQ.1FrAPoZ5Sn0l-SxvCjYffSXWF4ZJoI2jrMhSeol8YY0	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-11 04:11:54.737	2026-03-04 04:11:54.738
1ce902a2-61d2-4896-9106-26d84c29f97d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4YmJkNmRmLWNkMGYtNGI1YS04MzY0LWIwNTJkODE3MTU5NSIsImlhdCI6MTc3MjU5NzU5MSwiZXhwIjoxNzczMjAyMzkxfQ.kYlSUtu83hhlbKS_ksUsNUhzeQDrAxXQcMmQBijZiXA	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-11 04:13:11.816	2026-03-04 04:13:11.816
f4f8df61-1bec-43f7-a4e4-5245bbb94619	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3OGE4NGUyLTFjZjAtNDk1YS1iYmJhLTMzNzhjODUwNzQzZCIsImlhdCI6MTc3MjU5NzYzMSwiZXhwIjoxNzczMjAyNDMxfQ._9nsf2S28cY3rcBxzwqpxUR5filObegBawa4pRSjSXM	978a84e2-1cf0-495a-bbba-3378c850743d	2026-03-11 04:13:51.521	2026-03-04 04:13:51.522
3d7a08a0-c086-44ef-806b-75b12e94539a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjU5NzY0NiwiZXhwIjoxNzczMjAyNDQ2fQ.zB8vmgZfPrHvjHbZj92KwuxuJSUzXXTdThfnSJPUsXE	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-11 04:14:06.825	2026-03-04 04:14:06.826
926130c7-6bcc-4b91-aee2-a346a00da5c5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MjYxMTI4MiwiZXhwIjoxNzczMjE2MDgyfQ.K8i9OcGKO7iEUb87jcjkeRN13QWC84-Jtuwd2GcUFGo	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-11 08:01:22.198	2026-03-04 08:01:22.199
d055ee2b-7ce2-4f4e-b841-88afb88fd810	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4YmJkNmRmLWNkMGYtNGI1YS04MzY0LWIwNTJkODE3MTU5NSIsImlhdCI6MTc3MzEwODk2MywiZXhwIjoxNzczNzEzNzYzfQ.zKl75tlev_hNFuRS_GmsoAYlV_Ey4tiWhqJNhMsgtpY	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-17 02:16:03.445	2026-03-10 02:16:03.445
67b58daf-2380-4aaa-806c-5f3b96925e48	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MzExMDA1NSwiZXhwIjoxNzczNzE0ODU1fQ.axFa-2q2q4RK0x0DXe2gTLHLPbuz2-Sn2tw7AIV-t-s	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-17 02:34:15.984	2026-03-10 02:34:15.984
ff32de2c-8fc6-4ea4-9f70-15de407bc8b3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYjk3NTlhLTkyZjAtNDYzNi1hM2ZkLThkZTFhMzNhZTc5ZCIsImlhdCI6MTc3MzM2ODE1OSwiZXhwIjoxNzczOTcyOTU5fQ.2G3bvzrGY9rYHKRYT5YfZixXAduWNQYYK-j4-m9wkP8	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-20 02:15:59.068	2026-03-13 02:15:59.069
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.tags (id, name, color, "createdAt") FROM stdin;
d06b4232-6230-4140-9f17-e245d068af15	CMS	#3B82F6	2026-02-26 11:06:22.316
74cb94b9-1e16-46d5-871c-f205ef45b7d2	ยกยอด	#3B82F6	2026-03-04 04:54:33.522
\.


--
-- Data for Name: task_assignees; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.task_assignees (id, "taskId", "userId", "createdAt") FROM stdin;
c3881bce-f470-437d-8881-709eeb5fd0cc	c815595a-15a1-4122-a05e-5394658906b3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-16 06:21:51.294
ea705ce9-8f73-4ac8-8335-23b0b2731636	5454b8fe-1321-4d1d-9950-1bc2664c9606	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	2026-02-16 06:31:13.768
4baf853a-2037-4a65-9e16-e6a3e866aed1	60200437-9353-42bf-8b1d-d0df4cdb7103	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:42.668
281363eb-54c2-43f7-9ba9-d280ec49bb13	60200437-9353-42bf-8b1d-d0df4cdb7103	2b56085f-5933-46ce-8005-74a7088e301a	2026-02-26 11:01:42.668
db34718e-49fc-4075-83b0-1f42a6df19a9	882bf4da-fabc-4f80-9ac7-f8924d5bd118	2b56085f-5933-46ce-8005-74a7088e301a	2026-02-26 11:01:42.762
82b8d735-e6b8-4b60-b234-d32b92180528	78d0fb57-2083-491a-8259-f6a99e56383d	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:42.78
307b90d0-5259-40d2-a165-775bc8caef17	78d0fb57-2083-491a-8259-f6a99e56383d	2b56085f-5933-46ce-8005-74a7088e301a	2026-02-26 11:01:42.78
776710cf-b2c4-4dbc-96b3-ec9e85020bba	8576789f-2614-4955-aa3a-66a67ba709f2	2b56085f-5933-46ce-8005-74a7088e301a	2026-02-26 11:01:42.84
efefd3dd-93ae-43c9-8af4-ca823d954a3e	7893e7f1-4649-4ed9-bc6c-fd05836939e7	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:42.868
e715c5ab-71be-4d9f-851d-2e1816bacd5a	475b2c7e-1671-419c-be8e-8bfedab99f3f	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:42.902
1d40d488-9afc-4252-95a9-c5ba406f59ea	475b2c7e-1671-419c-be8e-8bfedab99f3f	2b56085f-5933-46ce-8005-74a7088e301a	2026-02-26 11:01:42.902
3a6dd452-dbd3-4e70-bc90-4f482a9a6480	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:43.002
dc2ed30c-1eb2-4094-b2fc-11bb4f4f78ec	6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	2b56085f-5933-46ce-8005-74a7088e301a	2026-02-26 11:01:43.002
81697025-1dbe-4459-9431-708b676dccc3	2bdfa381-3f04-42b0-84af-e35cc3995183	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:43.033
9889b769-d417-46aa-a821-cbd2b761b71c	2bdfa381-3f04-42b0-84af-e35cc3995183	2b56085f-5933-46ce-8005-74a7088e301a	2026-02-26 11:01:43.033
bde1253f-dc08-4999-8f08-7b03fff8af62	a354931c-b704-411f-9914-5cb799adbadc	978a84e2-1cf0-495a-bbba-3378c850743d	2026-02-26 11:01:43.104
97268211-d716-4bf4-a9c7-fc953daae991	a354931c-b704-411f-9914-5cb799adbadc	2b56085f-5933-46ce-8005-74a7088e301a	2026-02-26 11:01:43.104
70b98edb-a6a6-4456-9593-cfe6942cebd7	a3f8be70-2552-4943-9ac0-69d0ec148f86	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-04 08:08:02.865
7600e2a8-ddb2-4c6a-b688-636b28f965bf	c7040ddb-dac2-4a83-8798-103d3116aa29	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-10 03:29:21.311
8e3efd8c-8a83-4631-a5ce-533529661e47	ef7e7fff-a33b-4c6c-8b5d-ab246d6c3feb	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-10 03:29:51.657
effbed10-c729-4d51-8a88-11d292b48864	f1277d7c-2645-4ea1-8201-bef2aebead68	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-10 03:31:04.633
1813ce8f-2f8a-4c0c-99ff-a8ffa6428c9a	f1277d7c-2645-4ea1-8201-bef2aebead68	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-10 03:31:04.633
eb786986-eaa1-47cc-80a0-dff73a834f76	1c8e85d9-7a31-420a-ba50-271fca770ef1	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-10 03:44:39.474
8fc7bc5e-603e-4c75-ba09-2a75bfae2465	1c8e85d9-7a31-420a-ba50-271fca770ef1	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-10 03:44:39.474
06a29b81-bb17-4b5b-bddc-9e2b4f831634	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-10 03:44:56.109
8fc25bed-fe66-4095-bbab-da8af51f4ee2	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-10 03:44:56.109
6d7369df-31ca-4392-b571-02df4befa142	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-10 03:45:04.714
a8eed872-07f8-45eb-a77d-22b361dad174	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-10 03:45:04.714
f85bb2e8-d3c2-4c6e-85d2-2c24ffa2f718	d89e65a7-b78c-461b-a871-7f1847167f6a	c8bbd6df-cd0f-4b5a-8364-b052d8171595	2026-03-10 03:45:10.982
a7c47855-d081-48e3-9ae2-4dd09fcd87a4	d89e65a7-b78c-461b-a871-7f1847167f6a	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	2026-03-10 03:45:10.982
\.


--
-- Data for Name: task_tags; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.task_tags (id, "taskId", "tagId", "createdAt") FROM stdin;
94ba2fce-18a2-4a26-96c5-addfcd80ea38	a3f8be70-2552-4943-9ac0-69d0ec148f86	d06b4232-6230-4140-9f17-e245d068af15	2026-03-04 08:08:02.863
7e43a4d8-deb4-47d0-8b0f-8460e9dbc91d	c7040ddb-dac2-4a83-8798-103d3116aa29	d06b4232-6230-4140-9f17-e245d068af15	2026-03-10 03:29:21.289
6032d901-143a-4f07-867c-760e514bedff	f1277d7c-2645-4ea1-8201-bef2aebead68	d06b4232-6230-4140-9f17-e245d068af15	2026-03-10 03:31:04.631
25dde2f5-c8c4-4eb7-b036-594aa816e7c6	f8977616-f91f-4fa2-bfbf-1c49b616ed2a	d06b4232-6230-4140-9f17-e245d068af15	2026-03-10 03:44:56.106
385803d8-fd6c-446b-abe3-9ed59fd13757	ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	d06b4232-6230-4140-9f17-e245d068af15	2026-03-10 03:45:04.627
2bfbef18-bfe5-4dad-ac7f-dd626c6bc10b	d89e65a7-b78c-461b-a871-7f1847167f6a	d06b4232-6230-4140-9f17-e245d068af15	2026-03-10 03:45:10.971
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.tasks (id, title, description, status, priority, "projectId", "assigneeId", "createdById", "parentTaskId", "dueDate", "startDate", progress, "createdAt", "updatedAt", "sortOrder") FROM stdin;
60200437-9353-42bf-8b1d-d0df4cdb7103	ระบบรับ-ขาย วัสดุก่อสร้างโกดังพัฒนาการ 25 (คลังเอชาย) Phase I รายงาน	ระบบรับ-ขาย วัสดุก่อสร้างโกดังพัฒนาการ 25 (คลังเอชาย) Phase I รายงาน\nChange 26/01/2569 กับพี่วี\n\n---\nแนวทางแก้ไข: New Project Input / Form / Report / Mail\n1. ระบบโครงการสั่งขาย\n2. ระบบโกดังรับสินค้า แยกคลังเพื่อซื้อ (ออกใบรับสินค้าตามคลัง Mail)\n3. ระบบ Bom วัสดุก่อสร้าง\n4. ระบบโครงการสั่งซื้อ\n5. ระบบโกดังขายสินค้า (ออกใบแจ้งหนี้ Mail)\n\nผู้แจ้ง: วีรพร (บัญชี)\nมูลค่างาน: 100,000 บาท\nTheme: No.3	IN_PROGRESS	HIGH	36163cb1-a30d-4436-99c7-5f9f25f3c0ed	978a84e2-1cf0-495a-bbba-3378c850743d	978a84e2-1cf0-495a-bbba-3378c850743d	\N	2026-04-30 00:00:00	2026-01-05 00:00:00	30	2026-02-26 11:01:42.668	2026-02-26 11:01:42.668	0
882bf4da-fabc-4f80-9ac7-f8924d5bd118	เนื่องจากได้ขึ้นทะเบียนการใช้ระบบ E-tax ของ 3 บริษัท เรียบร้อยแล้วทางทีม I-NET แจ้ง Timeline สำหรับ Test ระบบ เป็นกลา...	เนื่องจากได้ขึ้นทะเบียนการใช้ระบบ E-tax ของ 3 บริษัท เรียบร้อยแล้วทางทีม I-NET แจ้ง Timeline สำหรับ Test ระบบ เป็นกลางเดือนมกราคม\n1. บริษัท เจ.เอส.พี.แอสพลัส จำกัด\n2. บริษัท บ้านพุทธรักษา 2015 จำกัด\n3. บริษัท บ้านพุทธชาด 2015 จำกัด\n\n---\nแนวทางแก้ไข: New Project เนื่องจากติดเรื่อง SMS กับ Inet\n\nผู้แจ้ง: ชญาณ์นันท์ (บัญชี SenX)\nมูลค่างาน: 30,000 บาท\nTheme: No.3	IN_PROGRESS	MEDIUM	57a4e05c-327d-4ed2-a46d-253538838be5	2b56085f-5933-46ce-8005-74a7088e301a	978a84e2-1cf0-495a-bbba-3378c850743d	\N	2026-03-31 00:00:00	2026-01-05 00:00:00	30	2026-02-26 11:01:42.762	2026-02-26 11:01:42.762	0
78d0fb57-2083-491a-8259-f6a99e56383d	ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)	ระบบภาษีที่ดิน Phase I (แปลงขาย+แปลงสาธารณูปโภค)\n1. Data มาจาก REM\n2. Web กรมธนารักษ์\n3. Report รายงานเป็น excel & Operation\n\n---\nแนวทางแก้ไข: New Project รอขั้นตอน 1 ของพี่ตรี กับขั้นตอน 2 ของกานต์\n\nผู้แจ้ง: วีรพร (CFO)\nมูลค่างาน: 50,000 บาท\nTheme: No.3	TODO	HIGH	57a4e05c-327d-4ed2-a46d-253538838be5	978a84e2-1cf0-495a-bbba-3378c850743d	978a84e2-1cf0-495a-bbba-3378c850743d	\N	2026-02-28 00:00:00	2026-01-08 00:00:00	0	2026-02-26 11:01:42.78	2026-02-26 11:01:42.78	0
8576789f-2614-4955-aa3a-66a67ba709f2	ขอนำส่งขั้นตอนการจัดทำหนังสือค้ำประกัน (LG) สำหรับ	ขอนำส่งขั้นตอนการจัดทำหนังสือค้ำประกัน (LG) สำหรับ\n• งานสาธารณูปโภค\n• งานส่วนของผู้รับเหมา\nสำหรับในส่วนของอีเมลแจ้งเตือนวันครบกำหนดสัญญาต่าง ๆ ขณะนี้พี่โจและทีมกำลังดำเนินการปรับแก้ไข โดยคาดว่าจะแล้วเสร็จภายในประมาณ 2 สัปดาห์ค่ะ\nหากมีข้อสงสัยหรือต้องการข้อมูลเพิ่มเติม สามารถสอบถามได้ทุกเมื่อค่ะ\n\n---\nแนวทางแก้ไข: New Project\n\nผู้แจ้ง: ศรีวรัตน์ (PD)\nมูลค่างาน: 5,000 บาท\nTheme: No.2	DONE	HIGH	57a4e05c-327d-4ed2-a46d-253538838be5	2b56085f-5933-46ce-8005-74a7088e301a	978a84e2-1cf0-495a-bbba-3378c850743d	\N	2026-02-15 00:00:00	2026-01-20 00:00:00	100	2026-02-26 11:01:42.84	2026-02-26 11:01:42.84	0
7893e7f1-4649-4ed9-bc6c-fd05836939e7	เนื่องจากคอมพิวเตอร์ให้เช่าสัญญาเลขที่ TOL23-0533 และ TOL23-0534 หมดสัญญากับทาง บจก.ไทยโอริกส์ ลีสซิ่งเมื่อวันที่ 11 ...	เนื่องจากคอมพิวเตอร์ให้เช่าสัญญาเลขที่ TOL23-0533 และ TOL23-0534 หมดสัญญากับทาง บจก.ไทยโอริกส์ ลีสซิ่งเมื่อวันที่ 11 พฤศจิกายน 2568 และ 11 ธันวาคม 2568 ตามลำดับ และบริษัทได้ทำการส่งคืนคอมพิวเตอร์ให้กับทางลีสซิ่งทั้งหมดแล้ว จึงอยากให้ทางพี่โจปรับปรุง Stock โดยนำสัญญา TOL23-0533 และ TOL23-0534 ออกจากรายงาน RC-2050 และ RC-2100 ครับ\n\n---\nแนวทางแก้ไข: New Project ทำระบบคืนสัญญา เพื่อไม่ให้ไปออกรายงานและเก็บข้อมูลสัญญาคืน\n\nผู้แจ้ง: ธนัฐพงษ์ (บัญชีรับ)\nมูลค่างาน: FOC บาท\nTheme: No.2	DONE	MEDIUM	57a4e05c-327d-4ed2-a46d-253538838be5	978a84e2-1cf0-495a-bbba-3378c850743d	978a84e2-1cf0-495a-bbba-3378c850743d	\N	2026-03-15 00:00:00	2026-01-22 00:00:00	100	2026-02-26 11:01:42.868	2026-02-26 11:01:42.868	0
475b2c7e-1671-419c-be8e-8bfedab99f3f	ระบบตรวจสอบผู้รับเหมา ในระบบค่าแรง เพิ่ม Module	ระบบตรวจสอบผู้รับเหมา ในระบบค่าแรง เพิ่ม Module\n\n---\nแนวทางแก้ไข: New เพิ่มการใส่ หักผรม ไม่หักผรม เช็คการใส่ค่า รายงานสำหรับบัญชี หน้า Upload/Download ให้ Audit ตรวจสอบ\n\nผู้แจ้ง: วณิภา (กรรมการ)\nมูลค่างาน: 50,000 บาท\nTheme: No.2	DONE	HIGH	57a4e05c-327d-4ed2-a46d-253538838be5	978a84e2-1cf0-495a-bbba-3378c850743d	978a84e2-1cf0-495a-bbba-3378c850743d	\N	2026-02-28 00:00:00	2026-01-28 00:00:00	100	2026-02-26 11:01:42.902	2026-02-26 11:01:42.902	0
6fd8f989-02f9-4fc0-8c06-0a6d4a08b524	ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม"	ฝ่ายอาคารสถานที่ มีความประสงค์ในการขอแก้ไขระบบจองห้องประชุม "โดยเพิ่มช่องจำนวน.........ผู้เข้าร่วมประชุม" หมายเหตุ : ขอให้เป็นหัวข้อ "แดง" ต้องกรอกข้อมูลทุกครั้ง\n\n---\nแนวทางแก้ไข: ปรับโครงสร้าง แก้ Master AMS แก้หน้า Web ตามคิว\n\nผู้แจ้ง: กรวิก (เจ้าหน้าที่ธุรการ)\nมูลค่างาน: 5,000 บาท\nTheme: No.2	IN_PROGRESS	MEDIUM	57a4e05c-327d-4ed2-a46d-253538838be5	978a84e2-1cf0-495a-bbba-3378c850743d	978a84e2-1cf0-495a-bbba-3378c850743d	\N	2026-02-28 00:00:00	2026-02-11 00:00:00	30	2026-02-26 11:01:43.002	2026-02-26 11:01:43.002	0
2bdfa381-3f04-42b0-84af-e35cc3995183	ฝ่าย ACM แผนก ตรวจวัสดุโครงการ ขอสิทธิ์ในการเข้าถึงโครงการทุกโครงการ ของระบบ AMS หมวดค่าแรง	ฝ่าย ACM แผนก ตรวจวัสดุโครงการ ขอสิทธิ์ในการเข้าถึงโครงการทุกโครงการ ของระบบ AMS หมวดค่าแรง เพื่อใช้ในการตรวจสอบ ของ USER: nisas\n\n---\nแนวทางแก้ไข: CR ปรับให้สิทธิ์เห็นทุกโครงการแบบ HR แต่ส่วนนี้คนเดียว\n\nผู้แจ้ง: นิษา (ประสานงานโครงการ)\nมูลค่างาน: 3,000 บาท\nTheme: No.2	TODO	HIGH	57a4e05c-327d-4ed2-a46d-253538838be5	978a84e2-1cf0-495a-bbba-3378c850743d	978a84e2-1cf0-495a-bbba-3378c850743d	\N	2026-03-15 00:00:00	2026-02-13 00:00:00	0	2026-02-26 11:01:43.033	2026-02-26 11:01:43.033	0
a354931c-b704-411f-9914-5cb799adbadc	ทำหน้า Web Get ค่ามิเตอร์ไฟฟ้า และนำเข้าระบบ SF จากเจ้าของระบบ พบ Error เขายังแก้ไขไม่ได้	ทำหน้า Web Get ค่ามิเตอร์ไฟฟ้า และนำเข้าระบบ SF จากเจ้าของระบบ พบ Error เขายังแก้ไขไม่ได้\n\n---\nแนวทางแก้ไข: เขียนใหม่ให้รองรับ Web\n\nผู้แจ้ง: ญานิดา (บัญชี)\nมูลค่างาน: 30,000 บาท\nTheme: No.3	TODO	HIGH	de992991-0fa6-4556-8417-1b3110ed4123	978a84e2-1cf0-495a-bbba-3378c850743d	978a84e2-1cf0-495a-bbba-3378c850743d	\N	2026-05-31 00:00:00	2026-02-02 00:00:00	0	2026-02-26 11:01:43.104	2026-02-26 11:01:43.104	0
ef7e7fff-a33b-4c6c-8b5d-ab246d6c3feb	สร้างรายงาน Cash Flow ของพี่วี	สร้างรายงาน Cash Flow ของพี่วี	HOLD	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	c8bbd6df-cd0f-4b5a-8364-b052d8171595	c8bbd6df-cd0f-4b5a-8364-b052d8171595	\N	\N	\N	0	2026-03-10 02:33:41.362	2026-03-10 03:29:51.822	0
3980bb98-8fb8-4428-ad04-7ff9618c041d	Report/Dashboard	Ref: PP26000-00-00	TODO	MEDIUM	a99c7383-2491-41f7-bf33-439aa9814c96	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.415	2026-02-16 08:55:27.11	4
956cff88-71aa-4dfc-8898-a18d0f26e2f3	ESS System ( Employee Dashboard,Emp document, Incentive&Commission Dashboard)	Ref: PP24002-00-00	IN_PROGRESS	MEDIUM	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	2026-01-30 17:00:00	\N	0	2026-01-27 02:13:21.421	2026-01-27 05:12:27.405	0
a15aa35d-94cc-47fb-914a-f0aafaa7bae0	HR Integration with Internal System (การเชื่อมต่อระบบ HR ไปหาระบบต่างๆ ของบริษัทเพื่อให้การเข้าใช้งานระบบสอดคล้องกับสถานะพนักงาน)	Ref: PP24002-00-00	IN_REVIEW	MEDIUM	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	2026-01-26 17:00:00	\N	0	2026-01-27 02:13:21.422	2026-01-27 05:12:08.093	0
2180e987-c198-43a1-9c08-922e1a3a7a53	ระบบบริหารวัสดุสิ้นเปลือง(Smartify)	Ref: PP26000-00-00	IN_PROGRESS	MEDIUM	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.418	2026-02-13 09:13:07.774	0
929ddd71-bab7-4f5b-87e0-a9de50eb2e65	SenX-Bot	Ref: PP26000-00-00	IN_PROGRESS	MEDIUM	e0f83878-68cb-41d1-8702-0f1b6c483f73	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.416	2026-02-14 17:53:55.192	0
a6296db5-56ac-4324-b2ea-46913334e90b	Smartify Backend System	Ref: PP26000-00-00	IN_PROGRESS	MEDIUM	e3ece6f9-0d88-4b44-8d19-587fd7e0f3ea	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	100	2026-01-27 02:13:21.417	2026-02-14 17:53:57.884	0
5454b8fe-1321-4d1d-9950-1bc2664c9606	Phase 1 : งานEDC สำหรับการรองรับการชำระ งานขาย สำหรับโครงการ	ดำเนินการ ร่วมกับทีม คุณจุ๊บ และ ทืม คุณโหน่ง(กลยุทธ์)\nเพื่อคัดเลือก Sponsor Bank ในการใช้งาน เครื่อง EDC เพื่อการต่อรอง ค่าธรรมเนียม	TODO	HIGH	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	2026-02-17 17:00:00	2026-02-10 17:00:00	100	2026-02-16 06:31:13.768	2026-02-16 09:13:53.81	0
b85e694e-de7e-420c-adaf-e1278fb46365	Construction Quality Tracking Process (งานซ่อมส่วนกลาง)	Ref: PP26000-00-00	DONE	MEDIUM	ef5179a3-452a-4cb5-b920-308926d729bc	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	100	2026-01-27 02:13:21.366	2026-02-27 09:54:31.187	57
c815595a-15a1-4122-a05e-5394658906b3	SENA 360 for Cashless payment	อ้างถึง Ref: PP26000-00-00\n-----\n	IN_PROGRESS	MEDIUM	e9487408-cfb3-41db-b47d-3f6ed81da018	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	2026-03-30 17:00:00	2026-01-31 17:00:00	0	2026-01-27 02:13:21.395	2026-02-16 06:21:51.644	0
065b7da2-fd30-4327-98c8-eaa252e2c293	คัดเลือก และ ศึกษาข้อมูลด้านเทคนิค สนับสนุนทีม กลยุทธ์ และคุณจุ๊บ เพื่อประเมิน ธนาคาร ที่มานำเสนอ	\N	IN_PROGRESS	MEDIUM	ee867f39-fdbb-48af-9abd-e48c7dcf0d43	\N	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	5454b8fe-1321-4d1d-9950-1bc2664c9606	\N	\N	50	2026-02-16 06:32:16.697	2026-02-16 06:32:22.133	0
1c8e85d9-7a31-420a-ba50-271fca770ef1	แบบประเมินร้านค้า 	จัดทำแบบประเมินร้านค้าเมื่อมีการทำรับของ	IN_PROGRESS	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	c8bbd6df-cd0f-4b5a-8364-b052d8171595	c8bbd6df-cd0f-4b5a-8364-b052d8171595	\N	2026-03-30 17:00:00	2026-03-01 17:00:00	25	2026-03-10 02:30:30.408	2026-03-10 03:44:39.525	0
ee1f9b9f-9555-41ed-8d8a-bb82482ed63d	รายงานทดสอบมูลค่าสุทธที่คราดว่าจะได้รับ 	จัดทำรายงานทดสอบมูลค่าสุทธที่คราดว่าจะได้รับ 	IN_PROGRESS	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	c8bbd6df-cd0f-4b5a-8364-b052d8171595	c8bbd6df-cd0f-4b5a-8364-b052d8171595	\N	\N	\N	25	2026-03-10 03:24:46.742	2026-03-10 03:45:04.721	0
d89e65a7-b78c-461b-a871-7f1847167f6a	รายงานวิเคราะห์อายุสินค้าคงเหลือ	จัดทำรายงานวิเคราะห์อายุสินค้าคงเหลือของบัญชีต้นทุน	IN_PROGRESS	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	c8bbd6df-cd0f-4b5a-8364-b052d8171595	c8bbd6df-cd0f-4b5a-8364-b052d8171595	\N	\N	\N	25	2026-03-10 03:23:55.821	2026-03-10 03:45:10.988	0
31486223-fd3c-4e16-9777-8244879e67c2	HR System	Ref: PP24002-00-00	TODO	MEDIUM	a0912d7f-a010-4cc5-9a02-6d0723f3f2a6	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.42	2026-02-16 08:55:27.11	3
22a90f4f-d5f3-4aa8-ad7a-2bc93ea22009	Integration to Construction Quality Tracking Process (งานซ่อมส่วนกลาง)	Ref: PP26000-00-00	TODO	MEDIUM	a99c7383-2491-41f7-bf33-439aa9814c96	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.414	2026-02-16 08:55:27.11	5
f8977616-f91f-4fa2-bfbf-1c49b616ed2a	รายงานแสดงตารางเปรียบเทียบสัดส่วนเหล็กต่อคอนกรีต	รายงานแสดงตารางเปรียบเทียบสัดส่วนเหล็กต่อคอนกรีต 	IN_PROGRESS	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	c8bbd6df-cd0f-4b5a-8364-b052d8171595	c8bbd6df-cd0f-4b5a-8364-b052d8171595	\N	\N	\N	25	2026-03-10 03:26:32.769	2026-03-10 03:44:56.112	0
ddb5baf9-8fba-4091-9599-bcaf2860d9a4	Merge ทุก Channel แยก Category อัตโนมัติ ด้วย AI	Ref: PP26000-00-00	TODO	MEDIUM	a99c7383-2491-41f7-bf33-439aa9814c96	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.413	2026-02-16 08:55:27.11	6
19d39f0d-b5ec-45e0-aa3b-e0784b148faa	KPI-Performance พนักงานรายบุคคล  OP1,OP2,OP3,OP4	Ref: PP26000-00-00	TODO	MEDIUM	81d95785-7416-4530-aecb-46e93376d356	\N	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.412	2026-02-16 08:55:27.11	7
ddbedc4a-1458-435a-8d8f-c3cb8a12a297	Cororate OKR/KPI (Continue)	Ref: PP26000-00-00	TODO	MEDIUM	81d95785-7416-4530-aecb-46e93376d356	\N	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.411	2026-02-16 08:55:27.11	8
a3fd27dc-3453-45d3-9d19-220c6a618119	Center KPI	Ref: PP26000-00-00	TODO	MEDIUM	81d95785-7416-4530-aecb-46e93376d356	\N	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.411	2026-02-16 08:55:27.11	9
aec36dbf-e750-4b2e-ba01-e21b601c0a7c	ศึกษาความเป็นไปได้ เพื่อนำเอามาใช้ร่วมกันกับ RentNex	Ref: PP26000-00-00	TODO	MEDIUM	a2b3999b-67e6-4ee4-ac84-53e9c55b9a50	\N	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.41	2026-02-16 08:55:27.11	10
b1c8bd24-09d1-4451-bd5a-901181c23c89	AMS to CMS with AI	Ref: PP26000-00-00	TODO	MEDIUM	4962b4f9-eea0-443f-96e0-a7d8ede2aaab	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.408	2026-02-16 08:55:27.11	11
acf70c9c-50f3-4937-8012-66a799ce68f9	ประสานงานราชการ FL.6 (มิเตอร์น้ำ-ไฟ,โฉนด,ทะเบียนบ้าน) -> REM	Ref: PP26000-00-00	TODO	MEDIUM	4962b4f9-eea0-443f-96e0-a7d8ede2aaab	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.408	2026-02-16 08:55:27.11	12
09669f6a-44ce-43e9-b098-aec5c2c47105	BOQ Update เข้าระบบ CMS ด้วย  AI	Ref: PP26000-00-00	TODO	MEDIUM	4962b4f9-eea0-443f-96e0-a7d8ede2aaab	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.407	2026-02-16 08:55:27.11	13
3d02b008-ec6f-401f-aa97-beaec98f52c5	SenX ค่าส่วนกลาง	Ref: PP26000-00-00	TODO	MEDIUM	4962b4f9-eea0-443f-96e0-a7d8ede2aaab	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.406	2026-02-16 08:55:27.11	14
4ad419d1-ceb7-44c8-bb29-da60a3ad8b54	AR/AP Automation (ต่อเนื่อง)	Ref: PP26000-00-00	TODO	MEDIUM	4962b4f9-eea0-443f-96e0-a7d8ede2aaab	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.405	2026-02-16 08:55:27.11	15
7c58e1cb-9ebd-47e4-8716-53b517c30f81	Automation with AI	Ref: PP26000-00-00	TODO	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.404	2026-02-16 08:55:27.11	16
722d4226-b014-45bc-815b-c82fd4c40d46	Report คงค้างทั้งหมด (Before Jul,26)	Ref: PP26000-00-00	TODO	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.403	2026-02-16 08:55:27.11	18
090e4dba-b3a3-4ac2-a407-01e66c06f3fe	SENA Warranty Center	Ref: PP26000-00-00	TODO	MEDIUM	3d6a3782-f454-4151-a4d7-e7edb56ec078	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.401	2026-02-16 08:55:27.11	20
1ffe73bc-38f0-4e2f-98fb-4185440ee5d3	Product Single View / Housing Traceability	Ref: PP26000-00-00	TODO	MEDIUM	3d6a3782-f454-4151-a4d7-e7edb56ec078	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.4	2026-02-16 08:55:27.11	21
1d0c1418-56cc-4b0b-bf0b-3261dfecc123	ปรับปรุงระบบโทรศัพท์ให้เรียกใช้งาน Customer Single View	Ref: PP26000-00-00	TODO	MEDIUM	225891bd-eb44-4597-81b4-d4ac4c36b301	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.399	2026-02-16 08:55:27.11	22
abcea3bf-5936-4930-8177-7ba19ea497e9	Customer Single View	Ref: PP26000-00-00	TODO	MEDIUM	225891bd-eb44-4597-81b4-d4ac4c36b301	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.398	2026-02-16 08:55:27.11	23
40b0d490-45ea-4938-a255-83a12d300e74	APP สำหรับส่งมอบห้อง RentNex (Scan ทรัพย์สินในห้อง)	Ref: PP26000-00-00	TODO	MEDIUM	f673b68c-6ea8-4de9-b6f4-679aba6b2193	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.397	2026-02-16 08:55:27.11	24
ee364a6f-95db-409c-969f-4a4b49b4e280	SENA RentNex App (Customer self service)	Ref: PP26000-00-00	TODO	MEDIUM	f673b68c-6ea8-4de9-b6f4-679aba6b2193	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.396	2026-02-16 08:55:27.11	25
f3532e89-fbda-44d8-aeb6-9e024c6eb714	SENA Agent Portal	Ref: PP26000-00-00	TODO	MEDIUM	e9487408-cfb3-41db-b47d-3f6ed81da018	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.394	2026-02-16 08:55:27.11	26
8f5a0aa8-3bd6-49e6-bcab-3abea3468400	SENA 360 Revamp Projects	Ref: PP26000-00-00	TODO	MEDIUM	e9487408-cfb3-41db-b47d-3f6ed81da018	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.394	2026-02-16 08:55:27.11	27
9b413e11-9716-40c5-853d-7821fe9c3e83	Batch 1	Ref: PP26000-00-00	TODO	MEDIUM	495d99eb-cdfc-4043-ae78-591df69946a6	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.393	2026-02-16 08:55:27.11	28
4723b4c9-1c76-4172-9600-d47c7f88b7f3	Batch 2	Ref: PP26000-00-00	TODO	MEDIUM	495d99eb-cdfc-4043-ae78-591df69946a6	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.392	2026-02-16 08:55:27.11	29
c7040ddb-dac2-4a83-8798-103d3116aa29	Golive - HHP32,HHP35,HHP36,HHP37  (7 โครงการ - อยู่ระหว่างก่อสร้าง)	Ref: PP26000-00-00	DONE	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	c8bbd6df-cd0f-4b5a-8364-b052d8171595	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	2026-02-27 17:00:00	2025-12-24 17:00:00	100	2026-01-27 02:13:21.402	2026-03-10 03:29:21.439	19
f1277d7c-2645-4ea1-8201-bef2aebead68	Golive - HHP9 , HHP4,HHP7,HHP11,HHP16,HHP17,HHP19,HHP22,HHP23 (X โครงการ - ก่อสร้างเรียบร้อยแล้ว)	Ref: PP26000-00-00	TODO	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.403	2026-03-10 03:31:04.634	17
160311b5-716c-488c-9307-17937deb91fe	E-Contract for LivNex	Ref: PP26000-00-00	TODO	MEDIUM	1bc7811c-cdce-40e4-b173-6f03031cca3b	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.391	2026-02-16 08:55:27.11	30
351f89b1-7454-4137-921e-a3e3715fc70c	E-Contract for RentNex	Ref: PP26000-00-00	TODO	MEDIUM	1bc7811c-cdce-40e4-b173-6f03031cca3b	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.39	2026-02-16 08:55:27.11	31
4cee06cd-6e5e-4daf-b611-e1b0fb5ad5cc	E-Contract for Real Estate	Ref: PP26000-00-00	TODO	MEDIUM	1bc7811c-cdce-40e4-b173-6f03031cca3b	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.389	2026-02-16 08:55:27.11	32
dc345689-344d-4825-aa29-b45395c8e71c	Web Payment Gateway & Integration with SENA360	Ref: PP26000-00-00	TODO	MEDIUM	ea6d076f-a136-4776-9a97-81624d476b2d	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.388	2026-02-16 08:55:27.11	33
2259dee7-6b10-497a-99d1-1aeb4a5b638d	AI - Sales process automations	Ref: PP26000-00-00	TODO	MEDIUM	ac0b1d1b-4d60-4d57-a821-f0bc07cdf56f	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.387	2026-02-16 08:55:27.11	34
f097b53a-4f35-405d-b7b2-de61200853e2	AI - Sales Activity Analysis	Ref: PP26000-00-00	TODO	MEDIUM	ac0b1d1b-4d60-4d57-a821-f0bc07cdf56f	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.385	2026-02-16 08:55:27.11	35
78d13571-349f-4d69-acf8-ec9ad0cca455	AI - Auto split customer documents	Ref: PP26000-00-00	TODO	MEDIUM	ac0b1d1b-4d60-4d57-a821-f0bc07cdf56f	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.384	2026-02-16 08:55:27.11	36
2f46fe56-a800-403e-ae1d-3ab840d4161f	Sales - ToDo(LivNex,RentNex,Smartify)	Ref: PP26000-00-00	TODO	MEDIUM	0b234b7e-df60-45b9-a2e0-b0aade0c3bf4	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.383	2026-02-16 08:55:27.11	37
2bd91afe-89a3-47c9-b09c-96666ec9db84	Sales - Dashboard (Performance)	Ref: PP26000-00-00	TODO	MEDIUM	0b234b7e-df60-45b9-a2e0-b0aade0c3bf4	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.382	2026-02-16 08:55:27.11	38
86032d24-179e-4b33-89e3-0f7de55f9423	Sales - ToDo(REM)	Ref: PP26000-00-00	TODO	MEDIUM	0b234b7e-df60-45b9-a2e0-b0aade0c3bf4	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.381	2026-02-16 08:55:27.11	39
4ddc0c44-59ef-448c-ac63-715437969a0f	SENA Agent Portal	Ref: PP26000-00-00	TODO	MEDIUM	efb455e7-99d7-49bf-a2d6-2eab256e3d48	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.38	2026-02-16 08:55:27.11	40
fa02384a-d438-4d49-b578-20796e3354a6	Friend Get Friends	Ref: PP26000-00-00	TODO	MEDIUM	efb455e7-99d7-49bf-a2d6-2eab256e3d48	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.379	2026-02-16 08:55:27.11	41
79ff0bae-f8c5-488c-95c8-75c32ce29f66	LivNex/RentNex - Exit Process	Ref: PP26000-00-00	TODO	MEDIUM	5849dc99-79aa-4a90-b12e-de37f91b68fd	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.378	2026-02-16 08:55:27.11	42
fb7eb3b1-70a6-45ab-b934-df626e8f5cd1	Samrtify Order on REM LivNex	Ref: PP26000-00-00	TODO	MEDIUM	5849dc99-79aa-4a90-b12e-de37f91b68fd	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.378	2026-02-16 08:55:27.11	43
a992b73a-2ddb-47ba-9556-441f95d48cf5	REM-Livnex ตารางเข้าตรวจสภาพห้อง	Ref: PP26000-00-00	TODO	MEDIUM	5849dc99-79aa-4a90-b12e-de37f91b68fd	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.377	2026-02-16 08:55:27.11	44
d19f4fd8-641d-4ad8-9c7f-c0a401376d0b	Price Analysis with AI / Dashboard  / Alert	Ref: PP26000-00-00	TODO	MEDIUM	036be266-5be9-4a8e-ab38-c23c38727147	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.376	2026-02-16 08:55:27.11	45
0693dd92-e0c4-4671-85d6-c20ed02e1746	Workflow Pricing Approval	Ref: PP26000-00-00	TODO	MEDIUM	036be266-5be9-4a8e-ab38-c23c38727147	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.375	2026-02-16 08:55:27.11	46
deb4f3c4-f95d-4235-bc9f-311f99a2783f	Price Management System	Ref: PP26000-00-00	TODO	MEDIUM	036be266-5be9-4a8e-ab38-c23c38727147	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.375	2026-02-16 08:55:27.11	47
f40889ab-c0f9-4b04-9570-c3df2603fe53	Sales-Bot	Ref: PP26000-00-00	TODO	MEDIUM	e6b9056b-f18f-48ad-a9b9-77a6b6dfbd59	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.374	2026-02-16 08:55:27.11	48
9e70d212-9869-4222-bd62-50ea126aa5e0	Integration FastInspect	Ref: PP26000-00-00	TODO	MEDIUM	c8e404ac-934a-4a9a-85e9-007a6a2bc2a1	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.372	2026-02-16 08:55:27.11	49
017454ba-6ec1-4da4-b316-12e69da4d9b5	Integration with Loan Activity and Bank Status	Ref: PP26000-00-00	TODO	MEDIUM	c8e404ac-934a-4a9a-85e9-007a6a2bc2a1	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.372	2026-02-16 08:55:27.11	50
6db2b4b6-4b41-4c6a-99aa-509c0116fbbf	Integration SiteMaps	Ref: PP26000-00-00	TODO	MEDIUM	c8e404ac-934a-4a9a-85e9-007a6a2bc2a1	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.371	2026-02-16 08:55:27.11	51
3366cdac-8abb-41bf-be4c-b3834ef07874	Integration REM (All versions)	Ref: PP26000-00-00	TODO	MEDIUM	c8e404ac-934a-4a9a-85e9-007a6a2bc2a1	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.37	2026-02-16 08:55:27.11	52
ee55124d-ab33-4f4f-baf2-170a119670e9	Core Booking-to-Transfer Tracking	Ref: PP26000-00-00	TODO	MEDIUM	c8e404ac-934a-4a9a-85e9-007a6a2bc2a1	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.37	2026-02-16 08:55:27.11	53
928fd623-6f76-4186-a1d3-51fad3da9239	Meta Conversion API	Ref: PP26000-00-00	TODO	MEDIUM	c501785c-5e19-4ab2-8db8-387a0823e073	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.369	2026-02-16 08:55:27.11	54
4b87fccd-1de7-4a0b-9db9-bf088650ffb2	SENA AI-Agent ให้ทำงานร่วมกับพนักงาน	Ref: PP26000-00-00	TODO	MEDIUM	27c3254a-19b3-41b5-85f7-306e9bfc6e35	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.368	2026-02-16 08:55:27.11	55
e7b73433-261b-4088-bcbc-c047d0ae482e	Lead follow-up omni-channal (Online Chat,Register)	Ref: PP26000-00-00	TODO	MEDIUM	27c3254a-19b3-41b5-85f7-306e9bfc6e35	9cb88436-60c7-4271-897f-40357bec5bd3	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.367	2026-02-16 08:55:27.11	56
b164b234-93da-434b-8b31-957b03e45142	UnitMatrix - for LivNex,RentNex (Integration with REMLivNex, REMRentNex)	Ref: PP26000-00-00	TODO	MEDIUM	ef5179a3-452a-4cb5-b920-308926d729bc	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.365	2026-02-16 08:55:27.11	58
6f494722-686a-4ab5-bd9d-2bffbcb3af22	Project Tracking(Sourcing,Purchasing)	Ref: PP26000-00-00	TODO	MEDIUM	ef5179a3-452a-4cb5-b920-308926d729bc	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.364	2026-02-16 08:55:27.11	59
d592fa87-a416-437f-81c2-18aa19c9fce3	Construction Operation (Infra-Progress, Unit-Progress, QS-Progress,Payment-Progress)	Ref: PP26000-00-00	TODO	MEDIUM	ef5179a3-452a-4cb5-b920-308926d729bc	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.363	2026-02-16 08:55:27.11	60
ed765328-3fb0-48b1-839e-175f41f8ffa4	Construction Planing (ConsPlan,On-Shelf,Inspection Plan,LivNex,RentNex)	Ref: PP26000-00-00	TODO	MEDIUM	ef5179a3-452a-4cb5-b920-308926d729bc	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.363	2026-02-16 08:55:27.11	61
7f321932-84de-404f-9265-f53759d41971	New PlanViewer(แนวราบ) / UnitMatrix(โครงการแนวสูง)	Ref: PP26000-00-00	TODO	MEDIUM	ef5179a3-452a-4cb5-b920-308926d729bc	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.362	2026-02-16 08:55:27.11	62
db0e3480-2fca-42d7-9c08-36d076d29007	Construction Dashboard	Ref: PP26000-00-00	TODO	MEDIUM	ef5179a3-452a-4cb5-b920-308926d729bc	03d7b1b4-253f-438c-8b02-ee0f689bea71	e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	\N	\N	\N	0	2026-01-27 02:13:21.359	2026-02-16 08:55:27.11	63
a3f8be70-2552-4943-9ac0-69d0ec148f86	TOR 12.20 12.28	12.20.  สามารถจัดทำรายวิเคระห์อายุสินค้าคงเหลือ  (  บ้านพร้อมขายที่ก่อสร้างเสร็จ 100%)\n12.28.  รายงานการทดสอบมูลค่าสุทธิที่คาดว่าจะได้รับของห้องที่ยังไม่ได้โอนกรรมสิทธิ์\n	TODO	MEDIUM	456d2de7-db65-4838-b503-b2138ff63090	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	4ab9759a-92f0-4636-a3fd-8de1a33ae79d	\N	2026-03-30 17:00:00	2026-03-03 17:00:00	0	2026-03-04 08:02:45.099	2026-03-04 08:08:02.867	0
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: taskflow
--

COPY public.users (id, email, password, name, role, "pinHash", "pinSetAt", "loginAttempts", "lockedUntil", "lastLoginAt", "passwordResetToken", "passwordResetExpires", "pinResetToken", "pinResetExpires", "createdAt", "updatedAt") FROM stdin;
50ca864c-729d-41a2-80cb-a762612b7719	team@sena.co.th	$2b$10$Atd5B6nsl.S4kJ8dSB5.0eqXWCOQfa5QhHanh6jgpmj/WTiwVdy.i	TEAM	MEMBER	$2b$10$XjlkWuCYuFbVjqmmauT4JuA2oCendYo7Eh8DpBJ799WGk8PMWOhjW	2026-02-15 05:39:56.507	0	\N	2026-02-15 05:39:28.294	\N	\N	\N	\N	2026-01-27 03:51:58.463	2026-02-15 05:39:56.508
03d7b1b4-253f-438c-8b02-ee0f689bea71	monchiant@sena.co.th	$2b$10$OZguvrC2XhRIRiK/YjsBPeG2Imj7SLcAd8nh5.fsa7QzOyVdOHKIu	มลเชียร (VP IT)	ADMIN	$2b$10$6hmJ37MBGHtwitn2cgIH5uBwQI65ERCKi.lFlvWuub4LYrzrZMMqu	2026-01-27 07:45:10.287	0	\N	2026-01-27 07:44:58.085	\N	\N	\N	\N	2026-01-27 02:07:04.348	2026-02-15 13:29:00.321
9cb88436-60c7-4271-897f-40357bec5bd3	nattapongm@sena.co.th	$2b$10$OZguvrC2XhRIRiK/YjsBPeG2Imj7SLcAd8nh5.fsa7QzOyVdOHKIu	ณัฐพงศ์ (Head Team)	OWNER	$2b$10$JxwRKs3nV3hEojLviVfWjO387eG5WSudaoCRzdPaUoaumHHjygCS.	2026-01-27 03:44:26.797	0	\N	2026-01-29 05:51:19.756	\N	\N	\N	\N	2026-01-27 02:07:04.355	2026-02-16 04:52:17.422
0a5e5451-de53-4130-8929-6cebc0d208dc	Ponwits@sena.co.th	$2b$10$3WXOJPdRR0ErEjbhWsPAFOeFWCfskIrKyycAnC1AwgbhJQrKtPpxy	พลวิทย์ (Head Team)	OWNER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:43.104	2026-03-02 03:59:45.726
978a84e2-1cf0-495a-bbba-3378c850743d	ekapons@sena.co.th	$2b$10$pr8hPBfMjHF5SE3JRz3Db.guk3lPjGLHepmfnMIRKGEqRqENCU0sS	เอกพล (Head Team)	OWNER	\N	\N	0	\N	2026-03-04 04:13:51.371	\N	\N	\N	\N	2026-02-16 05:07:42.997	2026-03-04 04:14:19.504
2b56085f-5933-46ce-8005-74a7088e301a	Sittichaid@sena.co.th	$2b$10$PvHqZJcNbQ47pRw6jnHPh.3KlI380mxChjDjBNHqI.U7bG.1RrieG	สิทธิชัย (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:43.315	2026-03-02 03:59:46.671
a48077d2-7d2b-474f-99ee-a39f18f6e2fe	chanetw@sena.co.th	$2b$10$aazkRrJjDCjyzvX.E77hLeX3UzuZHy1yuwCSkD7hGzO7h3tmjtHGy	ชเนษฎ์ (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:43.37	2026-03-02 03:59:47.005
51dc62c3-136b-4e00-bc2f-c641bf04a076	nattawutt@sena.co.th	$2b$10$qu2hDn9sFdl8.l2jyI/wz.zEWBGSq.fUiMXkOIpFpKw6670tXgCvC	ณัฐวุฒิ (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:43.489	2026-03-02 03:59:47.38
b05cd2a4-b355-4545-8521-762fdb91f33e	tanisony@sena.co.th	$2b$10$RsAveImTEz8HbNC5hDr2kOJeAOaBSUrseHOQ8gLmVxeUKhPwSdt4a	ธนิสร (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:45.062	2026-03-02 03:59:49.337
ecb591b1-4e1b-42a2-a9cb-ee426cabca0a	pasitl@sena.co.th	$2b$10$qATkzcadnaseYkVp0.tA.eFZiPpkSk35LVLqMG22EHh2GJ/lE0Jte	พสิษฐ์ (A.Head Team)	OWNER	\N	\N	0	\N	2026-02-16 05:10:00.801	\N	\N	\N	\N	2026-02-16 05:07:43.052	2026-02-16 05:10:00.802
a9c2c6c3-5db3-44df-b514-1f735a3f28c9	thanasaks@sena.co.th	$2b$10$ig/n.qy/z63vSscAofNVzONw/rYvBerrDGgprRTm1DcDWnIHoh3hS	ธนศักดิ์ (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:43.636	2026-03-02 03:59:47.482
2e61db47-d3f9-44e0-a38b-fc1f45775bc1	manits@sena.co.th	$2b$10$448TZY6Hy9yJC1FrUpvA5u/IrpeCI8aIH6nlkNpT0WMkAyANAK33a	มานิตย์ (Member)	OWNER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:43.157	2026-03-02 03:59:46.056
4ab9759a-92f0-4636-a3fd-8de1a33ae79d	adinuna@sena.co.th	$2b$10$OZguvrC2XhRIRiK/YjsBPeG2Imj7SLcAd8nh5.fsa7QzOyVdOHKIu	อดินันท์ (PMO)	ADMIN	$2b$10$f.H95Lj8ob1GJ5LtDh9zIOGsTATI6OrgTj5LtK8C0kF8hPesX0rDq	2026-01-27 03:58:34.876	0	\N	2026-03-13 02:15:59.048	\N	\N	\N	\N	2026-01-27 02:07:04.356	2026-03-13 02:15:59.05
c3e48455-c4fb-4fc1-a934-6f1993f7480e	ratsib@sena.co.th	$2b$10$ikhKrq.AFAu1//Pjvn1U/.7JlxvACziT1gyq1b/eYoAQ538hlu/GO	รัชช์ศิร์  (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:43.261	2026-03-02 03:59:46.413
e5acc7fd-c5c0-4310-852e-b5ee5f4e4afd	tharab@sena.co.th	$2b$10$OZguvrC2XhRIRiK/YjsBPeG2Imj7SLcAd8nh5.fsa7QzOyVdOHKIu	ธรา (Head Team)	OWNER	$2b$10$u28iq/ZzX3YjhEHytE7AMOYGjcvtBH/7QARKu4R5X4GWZ1dsyrPN.	2026-01-27 02:39:15.951	0	\N	2026-03-02 03:57:03.643	\N	\N	\N	\N	2026-01-26 09:29:35.65	2026-03-02 03:57:03.644
8300383c-9ce7-4193-8e6d-cb10ecee8ec2	chayapols@sena.co.th	$2b$10$/tHbobcPk7xdXkJugQgDC.q7LwLLmG8LG0ReoYc43suQscbSkLpie	ชยพล (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:43.77	2026-03-02 03:59:47.568
18d04ce9-ae4b-4d06-b84a-5cae6eed6174	chanonk@sena.co.th	$2b$10$WQ/PNsW7h0EBIii.Tstje.cYNRHmhsBa.JuknTRmDswgyBCXOWJV2	ชานนท์ (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.061	2026-03-02 03:59:47.806
b6f58fa5-2fca-4d13-b784-dfa82921518a	Sooksunb@sena.co.th	$2b$10$YN071DuNsyoJe5negpIoaOX0hjvAg.v5udQKHdN/VScfLwFukBWJi	สุขสันต์ (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.116	2026-03-02 03:59:48.058
8812ee4d-56f7-4df3-a0c3-43e4210faf15	siripornt@sena.co.th	$2b$10$nCHrV5yITpFGLcMaaiP8Eexv4BCrPf3LviBzpvTHq1l0Zy4660wUa	ศิริพร (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.167	2026-03-02 03:59:48.167
b5e7f962-4acf-4215-851e-0cdda0608dae	Supanats@sena.co.th	$2b$10$9ZKCpUFEP5sIkN72G6HBE.n/o3YqVNWigJkMjcuFJc5G2vjUeY3Ke	ศุภณัฐ (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.22	2026-03-02 03:59:48.248
da167a65-0699-4a24-92fa-05cfb6714f42	porametk@sena.co.th	$2b$10$ZTTPPVVpJHpENh8wzEJg3.C7CbR6S6N76EZ86VL.rAv7tK285e0p6	ปรเมศวร์ (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.274	2026-03-02 03:59:48.412
30d44b2d-3723-431d-83d2-ef898597be68	Rujiran@sena.co.th	$2b$10$6UxCaLG.Y4gBSbE4XRjfJO7tnFfPpRgiHO3IaO.BE8oiJqR9ud/SK	รุจิรา (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.334	2026-03-02 03:59:48.503
9cc70dac-c379-42a6-ba42-8111a4b7cbfe	watcharink@sena.co.th	$2b$10$ns8vVbHwlu/Nochz8wtoB.ORgueKUgNJ/kzSemg1Lmftx4wBFhzV6	วัชรินทร์ (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.394	2026-03-02 03:59:48.598
817b2228-e11a-4916-8e6e-67c9ebbf8b5f	jaratw@sena.co.th	$2b$10$M469AXa8LXwET6JSxN7YSObWuMyueiUfNjLyRUgNVqMJDyQ0Z2axG	จรัส (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.584	2026-03-02 03:59:48.784
f1f74a02-130e-407b-a38f-dd6baa2a3388	saranyat@sena.co.th	$2b$10$j5FvnAVqJaWxIJizqXHq5uE3nRFZsWWJMjMqNceMHCDwKlE39wfUK	สรัญญา (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.7	2026-03-02 03:59:49.005
68ca8d28-ac6f-4d00-9a15-cff9ee113c83	wanniks@sena.co.th	$2b$10$UO1sSKj2uOv.uwsaayymTe2Jm3hdW0GX7bdgc777XBL/1u4gAa66O	วรรณิก (Member)	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-16 05:07:44.95	2026-03-02 03:59:49.154
5220ecc8-df0c-4bc8-bbf7-8ca9f0296052	Pending to search email	$2b$10$THlI40dZgd/py7Kz1pVPTetfguHPyKW6vi.hzSf1HBz36bg6TiAxe	Pending to search email	MEMBER	\N	\N	0	\N	\N	\N	\N	\N	\N	2026-02-15 05:33:24.884	2026-03-02 03:59:49.588
ed5c2690-28cb-4942-8f4f-fa482038b1af	thanongsakn@sena.co.th	$2b$10$5kgBmpJAt1boWqI6DkxVMucHna0KnpQ.0VHblx5vK4JtkuoGOxyt2	ทนงศักดิ์ (Member)	OWNER	\N	\N	0	\N	2026-03-02 04:00:29.108	\N	\N	\N	\N	2026-02-16 05:07:45.003	2026-03-02 04:00:29.108
c8bbd6df-cd0f-4b5a-8364-b052d8171595	vichate_it@sena.co.th	$2b$10$Bdae9vQO6Srwq3vb1kQMce0ZTofn90AYAxeg5hi8KiNfmY4EK3GRe	วิเชฐ (Head Team)	OWNER	\N	\N	0	\N	2026-03-10 02:16:03.441	\N	\N	\N	\N	2026-02-16 05:07:43.209	2026-03-10 02:16:03.442
\.


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: daily_updates daily_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.daily_updates
    ADD CONSTRAINT daily_updates_pkey PRIMARY KEY (id);


--
-- Name: group_members group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_pkey PRIMARY KEY (id);


--
-- Name: group_projects group_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.group_projects
    ADD CONSTRAINT group_projects_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: project_members project_members_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: task_assignees task_assignees_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT task_assignees_pkey PRIMARY KEY (id);


--
-- Name: task_tags task_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: activity_logs_createdAt_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "activity_logs_createdAt_idx" ON public.activity_logs USING btree ("createdAt");


--
-- Name: activity_logs_projectId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "activity_logs_projectId_idx" ON public.activity_logs USING btree ("projectId");


--
-- Name: activity_logs_taskId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "activity_logs_taskId_idx" ON public.activity_logs USING btree ("taskId");


--
-- Name: activity_logs_userId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "activity_logs_userId_idx" ON public.activity_logs USING btree ("userId");


--
-- Name: attachments_commentId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "attachments_commentId_idx" ON public.attachments USING btree ("commentId");


--
-- Name: comments_taskId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "comments_taskId_idx" ON public.comments USING btree ("taskId");


--
-- Name: comments_userId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "comments_userId_idx" ON public.comments USING btree ("userId");


--
-- Name: daily_updates_date_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX daily_updates_date_idx ON public.daily_updates USING btree (date);


--
-- Name: daily_updates_taskId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "daily_updates_taskId_idx" ON public.daily_updates USING btree ("taskId");


--
-- Name: group_members_groupId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "group_members_groupId_idx" ON public.group_members USING btree ("groupId");


--
-- Name: group_members_groupId_userId_key; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE UNIQUE INDEX "group_members_groupId_userId_key" ON public.group_members USING btree ("groupId", "userId");


--
-- Name: group_members_userId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "group_members_userId_idx" ON public.group_members USING btree ("userId");


--
-- Name: group_projects_groupId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "group_projects_groupId_idx" ON public.group_projects USING btree ("groupId");


--
-- Name: group_projects_groupId_projectId_key; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE UNIQUE INDEX "group_projects_groupId_projectId_key" ON public.group_projects USING btree ("groupId", "projectId");


--
-- Name: group_projects_projectId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "group_projects_projectId_idx" ON public.group_projects USING btree ("projectId");


--
-- Name: notifications_createdAt_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "notifications_createdAt_idx" ON public.notifications USING btree ("createdAt");


--
-- Name: notifications_isRead_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "notifications_isRead_idx" ON public.notifications USING btree ("isRead");


--
-- Name: notifications_userId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "notifications_userId_idx" ON public.notifications USING btree ("userId");


--
-- Name: project_members_projectId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "project_members_projectId_idx" ON public.project_members USING btree ("projectId");


--
-- Name: project_members_projectId_userId_key; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE UNIQUE INDEX "project_members_projectId_userId_key" ON public.project_members USING btree ("projectId", "userId");


--
-- Name: project_members_userId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "project_members_userId_idx" ON public.project_members USING btree ("userId");


--
-- Name: projects_ownerId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "projects_ownerId_idx" ON public.projects USING btree ("ownerId");


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


--
-- Name: refresh_tokens_userId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "refresh_tokens_userId_idx" ON public.refresh_tokens USING btree ("userId");


--
-- Name: tags_name_key; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE UNIQUE INDEX tags_name_key ON public.tags USING btree (name);


--
-- Name: task_assignees_taskId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "task_assignees_taskId_idx" ON public.task_assignees USING btree ("taskId");


--
-- Name: task_assignees_taskId_userId_key; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE UNIQUE INDEX "task_assignees_taskId_userId_key" ON public.task_assignees USING btree ("taskId", "userId");


--
-- Name: task_assignees_userId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "task_assignees_userId_idx" ON public.task_assignees USING btree ("userId");


--
-- Name: task_tags_tagId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "task_tags_tagId_idx" ON public.task_tags USING btree ("tagId");


--
-- Name: task_tags_taskId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "task_tags_taskId_idx" ON public.task_tags USING btree ("taskId");


--
-- Name: task_tags_taskId_tagId_key; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE UNIQUE INDEX "task_tags_taskId_tagId_key" ON public.task_tags USING btree ("taskId", "tagId");


--
-- Name: tasks_assigneeId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "tasks_assigneeId_idx" ON public.tasks USING btree ("assigneeId");


--
-- Name: tasks_createdById_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "tasks_createdById_idx" ON public.tasks USING btree ("createdById");


--
-- Name: tasks_dueDate_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "tasks_dueDate_idx" ON public.tasks USING btree ("dueDate");


--
-- Name: tasks_parentTaskId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "tasks_parentTaskId_idx" ON public.tasks USING btree ("parentTaskId");


--
-- Name: tasks_projectId_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX "tasks_projectId_idx" ON public.tasks USING btree ("projectId");


--
-- Name: tasks_status_idx; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE INDEX tasks_status_idx ON public.tasks USING btree (status);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: taskflow
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: activity_logs activity_logs_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "activity_logs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_logs activity_logs_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "activity_logs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_logs activity_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attachments attachments_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT "attachments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_parentCommentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: daily_updates daily_updates_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.daily_updates
    ADD CONSTRAINT "daily_updates_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_members group_members_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_members group_members_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT "group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_projects group_projects_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.group_projects
    ADD CONSTRAINT "group_projects_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_projects group_projects_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.group_projects
    ADD CONSTRAINT "group_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_members project_members_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_members project_members_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT "project_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects projects_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_assignees task_assignees_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT "task_assignees_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_assignees task_assignees_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT "task_assignees_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_tags task_tags_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT "task_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_tags task_tags_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT "task_tags_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tasks tasks_assigneeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tasks tasks_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tasks tasks_parentTaskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tasks tasks_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taskflow
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict JV6HXPuGbO7iwmlx6fpBpzbZUBL7YMvm5pYxSmcK4JrLHIcIs2f9FUpc8dNSVvJ


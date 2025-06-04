--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: hubble; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA hubble;


--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgsodium;


--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_functions;


--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- Name: v1_cosmos; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA v1_cosmos;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: hypopg; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hypopg WITH SCHEMA extensions;


--
-- Name: EXTENSION hypopg; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION hypopg IS 'Hypothetical indexes for PostgreSQL';


--
-- Name: index_advisor; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS index_advisor WITH SCHEMA extensions;


--
-- Name: EXTENSION index_advisor; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION index_advisor IS 'Query index advisor';


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_event_trigger_ddl_commands() AS ev
      JOIN pg_extension AS ext
      ON ev.objid = ext.oid
      WHERE ext.extname = 'pg_net'
    )
    THEN
      GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

      IF EXISTS (
        SELECT FROM pg_extension
        WHERE extname = 'pg_net'
        -- all versions in use on existing projects as of 2025-02-20
        -- version 0.12.0 onwards don't need these applied
        AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
      ) THEN
        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

        REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
        REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

        GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
        GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      END IF;
    END IF;
  END;
  $$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: hubble; Owner: -
--

CREATE FUNCTION hubble.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: events; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.events (
    chain_id integer NOT NULL,
    block_hash text NOT NULL,
    height bigint NOT NULL,
    transaction_hash text,
    transaction_index integer,
    index integer NOT NULL,
    data jsonb NOT NULL,
    "time" timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE events; Type: COMMENT; Schema: v1_cosmos; Owner: -
--

COMMENT ON TABLE v1_cosmos.events IS 'DEPRECATED: use V1';


--
-- Name: attributes(v1_cosmos.events); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.attributes(v1_cosmos.events) RETURNS jsonb
    LANGUAGE sql IMMUTABLE PARALLEL SAFE
    AS $_$
  select (
    select
      jsonb_object_agg(j->>'key', j->>'value')
    from jsonb_array_elements($1.data->'attributes') j
);
$_$;


--
-- Name: insert_pool_and_blockfix(text, integer, bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.insert_pool_and_blockfix(p_address text, p_internal_chain_id integer, p_height bigint) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    result       JSONB;
    v_indexer_id TEXT;
    v_end_height BIGINT;
BEGIN
    SELECT indexer_id
    INTO v_indexer_id
    FROM hubble.chains
    WHERE id = p_internal_chain_id;

    IF v_indexer_id IS NULL THEN
        RAISE EXCEPTION 'No indexer_id found for internal_chain_id: %', p_internal_chain_id;
    END IF;

    SELECT MAX(height)
    INTO v_end_height
    FROM hubble.block_status
    WHERE indexer_id = v_indexer_id;

    IF v_end_height IS NULL THEN
        RAISE EXCEPTION 'No blocks found in block_status for indexer_id: %', v_indexer_id;
    END IF;

    INSERT INTO v1_cosmos.contracts (address,
                                     internal_chain_id,
                                     start_height)
    VALUES (p_address,
            p_internal_chain_id,
            p_height);

    INSERT INTO hubble.block_fix (indexer_id,
                                  start_height,
                                  end_height)
    VALUES (v_indexer_id,
            p_height,
            v_end_height);

    result := jsonb_build_object('success', true);

    RETURN result;
END;
$$;


--
-- Name: replication_schedule_reset_chain(numeric, bigint, text); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.replication_schedule_reset_chain(IN chain_id_param numeric, IN new_replication_height_param bigint, IN reason_param text)
    LANGUAGE plpgsql
    AS $$
BEGIN
END;
$$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


--
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: -
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
    DECLARE
      request_id bigint;
      payload jsonb;
      url text := TG_ARGV[0]::text;
      method text := TG_ARGV[1]::text;
      headers jsonb DEFAULT '{}'::jsonb;
      params jsonb DEFAULT '{}'::jsonb;
      timeout_ms integer DEFAULT 1000;
    BEGIN
      IF url IS NULL OR url = 'null' THEN
        RAISE EXCEPTION 'url argument is missing';
      END IF;

      IF method IS NULL OR method = 'null' THEN
        RAISE EXCEPTION 'method argument is missing';
      END IF;

      IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
        headers = '{"Content-Type": "application/json"}'::jsonb;
      ELSE
        headers = TG_ARGV[2]::jsonb;
      END IF;

      IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
        params = '{}'::jsonb;
      ELSE
        params = TG_ARGV[3]::jsonb;
      END IF;

      IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
        timeout_ms = 1000;
      ELSE
        timeout_ms = TG_ARGV[4]::integer;
      END IF;

      CASE
        WHEN method = 'GET' THEN
          SELECT http_get INTO request_id FROM net.http_get(
            url,
            params,
            headers,
            timeout_ms
          );
        WHEN method = 'POST' THEN
          payload = jsonb_build_object(
            'old_record', OLD,
            'record', NEW,
            'type', TG_OP,
            'table', TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA
          );

          SELECT http_post INTO request_id FROM net.http_post(
            url,
            payload,
            params,
            headers,
            timeout_ms
          );
        ELSE
          RAISE EXCEPTION 'method argument % is invalid', method;
      END CASE;

      INSERT INTO supabase_functions.hooks
        (hook_table_id, hook_name, request_id)
      VALUES
        (TG_RELID, TG_NAME, request_id);

      RETURN NEW;
    END
  $$;


--
-- Name: insert_missing_token_prices_by_block(); Type: PROCEDURE; Schema: v1_cosmos; Owner: -
--

CREATE PROCEDURE v1_cosmos.insert_missing_token_prices_by_block()
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Insert new rows for heights missing in token_prices_by_block
    INSERT INTO v1_cosmos.token_prices_by_block (
        height,
        "timestamp",
        next_timestamp,
        next_height,
        seconds_between_blocks,
        denomination,
        price,
        decimals,
        token_name
    )
    SELECT
        bd.height,
        bd."timestamp",
        bd.next_timestamp,
        bd.next_height,
        EXTRACT(epoch FROM bd.next_timestamp - bd."timestamp") AS seconds_between_blocks,
        t.denomination,
        closest_tp.price,
        t.decimals,
        t.token_name
    FROM v1_cosmos.materialized_block_data bd
    JOIN v1_cosmos.token t ON true
    CROSS JOIN LATERAL (
        SELECT DISTINCT token.token_name
        FROM v1_cosmos.token
    ) all_tokens
    LEFT JOIN LATERAL (
        SELECT
            tp.token,
            tp.price,
            ROW_NUMBER() OVER (PARTITION BY tp.token ORDER BY (abs(EXTRACT(epoch FROM bd."timestamp" - tp.created_at)))) AS rn
        FROM v1_cosmos.token_prices tp
        WHERE tp.token = all_tokens.token_name
        AND tp.price IS NOT NULL
    ) closest_tp ON closest_tp.token = all_tokens.token_name AND closest_tp.rn = 1
    WHERE bd.next_height IS NOT NULL
    AND t.token_name = all_tokens.token_name
    AND NOT EXISTS (  -- Add this condition to check for missing heights
        SELECT 1
        FROM v1_cosmos.token_prices_by_block tpb
        WHERE tpb.height = bd.height
    );
END;
$$;


--
-- Name: insert_pool_and_blockfix(text, integer, bigint); Type: FUNCTION; Schema: v1_cosmos; Owner: -
--

CREATE FUNCTION v1_cosmos.insert_pool_and_blockfix(p_address text, p_internal_chain_id integer, p_height bigint) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  result JSONB;
  v_indexer_id TEXT;
  v_end_height BIGINT;
BEGIN
  -- First, get the indexer_id from hubble.chains
  SELECT indexer_id INTO v_indexer_id
  FROM hubble.chains
  WHERE id = p_internal_chain_id;

  -- Check if we found an indexer_id
  IF v_indexer_id IS NULL THEN
    RAISE EXCEPTION 'No indexer_id found for internal_chain_id: %', p_internal_chain_id;
  END IF;

  -- Get the max height from hubble.block_status
  SELECT MAX(height) INTO v_end_height
  FROM hubble.block_status
  WHERE indexer_id = v_indexer_id;

  -- Check if we found a max height
  IF v_end_height IS NULL THEN
    RAISE EXCEPTION 'No blocks found in block_status for indexer_id: %', v_indexer_id;
  END IF;

  -- Insert into contracts table
  INSERT INTO v1_cosmos.contracts (
    address,
    internal_chain_id,
    start_height
  ) VALUES (
    p_address,
    p_internal_chain_id,
    p_height
  );

  -- Insert into hubble.blockfix table
  INSERT INTO hubble.block_fix (
    indexer_id,
    start_height,
    end_height
  ) VALUES (
    v_indexer_id,
    p_height,
    v_end_height
  );

  RETURN jsonb_build_object('success', true);

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;


--
-- Name: on_materialized_block_data_refresh(); Type: FUNCTION; Schema: v1_cosmos; Owner: -
--

CREATE FUNCTION v1_cosmos.on_materialized_block_data_refresh() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Call the procedure to insert missing token prices.
  CALL v1_cosmos.insert_missing_token_prices_by_block();
  RETURN NULL; -- Important:  Trigger functions must return NULL for AFTER triggers.
END;
$$;


--
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: -
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: assets; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.assets (
    chain_id integer NOT NULL,
    denom text NOT NULL,
    display_symbol text,
    decimals integer,
    logo_uri text,
    display_name text,
    gas_token boolean DEFAULT false NOT NULL,
    source text
);


--
-- Name: block_fix; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.block_fix (
    indexer_id text NOT NULL,
    start_height bigint NOT NULL,
    end_height bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: block_status; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.block_status (
    indexer_id text NOT NULL,
    height bigint NOT NULL,
    hash text NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: chains; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.chains (
    id integer NOT NULL,
    chain_id text NOT NULL,
    display_name text,
    testnet boolean,
    max_tip_age_seconds numeric,
    rpc_type text,
    addr_prefix text,
    enabled boolean DEFAULT false NOT NULL,
    logo_uri text,
    enabled_staging boolean DEFAULT false NOT NULL,
    execution boolean DEFAULT false NOT NULL,
    indexer_id text,
    max_mapped_execution_height_gap integer
);


--
-- Name: COLUMN chains.execution; Type: COMMENT; Schema: hubble; Owner: -
--

COMMENT ON COLUMN hubble.chains.execution IS 'Execution chain indicator, which implies that there is also a beacon chain.';


--
-- Name: chains_id_seq; Type: SEQUENCE; Schema: hubble; Owner: -
--

CREATE SEQUENCE hubble.chains_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chains_id_seq; Type: SEQUENCE OWNED BY; Schema: hubble; Owner: -
--

ALTER SEQUENCE hubble.chains_id_seq OWNED BY hubble.chains.id;


--
-- Name: clients; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.clients (
    chain_id integer NOT NULL,
    client_id text NOT NULL,
    counterparty_chain_id text NOT NULL
);


--
-- Name: consensus_heights; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.consensus_heights (
    chain_id integer NOT NULL,
    execution_height bigint NOT NULL,
    consensus_height bigint NOT NULL
);


--
-- Name: contract_status; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.contract_status (
    internal_chain_id integer NOT NULL,
    address text NOT NULL,
    height bigint NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: indexer_status; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.indexer_status (
    indexer_id text NOT NULL,
    height bigint NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: token_source_representations; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.token_source_representations (
    token_source_id integer NOT NULL,
    internal_chain_id integer NOT NULL,
    address bytea NOT NULL,
    symbol text NOT NULL,
    name text NOT NULL,
    decimals integer NOT NULL,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: token_sources; Type: TABLE; Schema: hubble; Owner: -
--

CREATE TABLE hubble.token_sources (
    id integer NOT NULL,
    source_uri text NOT NULL,
    name text NOT NULL,
    logo_uri text,
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: token_sources_id_seq; Type: SEQUENCE; Schema: hubble; Owner: -
--

CREATE SEQUENCE hubble.token_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: token_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: hubble; Owner: -
--

ALTER SEQUENCE hubble.token_sources_id_seq OWNED BY hubble.token_sources.id;


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: -
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


--
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: -
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: -
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: -
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: -
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


--
-- Name: pools; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.pools AS
 WITH create_pair AS (
         SELECT (public.attributes(events.*) ->> 'action'::text) AS action,
            (public.attributes(events.*) ->> 'pair'::text) AS pair,
            (public.attributes(events.*) ->> '_contract_address'::text) AS factory_address,
            (public.attributes(events.*) ->> 'msg_index'::text) AS msg_index,
            events.chain_id AS internal_chain_id,
            events.block_hash,
            events.height,
            events.index,
            events."time" AS "timestamp",
            events.transaction_hash,
            events.transaction_index,
            NULL::integer AS transaction_event_index,
            events.data
           FROM v1_cosmos.events
          WHERE ((events.data ->> 'type'::text) = 'wasm-create_pair'::text)
        ), register AS (
         SELECT (public.attributes(events.*) ->> 'action'::text) AS action,
            (public.attributes(events.*) ->> 'pair_contract_addr'::text) AS pair_contract_addr,
            (public.attributes(events.*) ->> '_contract_address'::text) AS factory_address,
            (public.attributes(events.*) ->> 'msg_index'::text) AS msg_index,
            events.chain_id AS internal_chain_id,
            events.block_hash,
            events.height,
            events.index,
            events."time" AS "timestamp",
            events.transaction_hash,
            events.transaction_index,
            NULL::integer AS transaction_event_index,
            events.data
           FROM v1_cosmos.events
          WHERE ((events.data ->> 'type'::text) = 'wasm-register'::text)
        )
 SELECT split_part(cp.pair, '-'::text, 1) AS token0,
    split_part(cp.pair, '-'::text, 2) AS token1,
    r.pair_contract_addr AS pool_address,
    (cp.msg_index)::integer AS msg_index,
    cp.internal_chain_id,
    cp.block_hash,
    cp.height,
    cp.index AS create_index,
    r.index AS register_index,
    cp."timestamp",
    cp.transaction_hash,
    cp.transaction_index AS create_transaction_index,
    r.transaction_index AS register_transaction_index
   FROM (create_pair cp
     JOIN register r ON ((cp.transaction_hash = r.transaction_hash)));


--
-- Name: add_liquidity; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.add_liquidity AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    (public.attributes(events.*) ->> 'receiver'::text) AS receiver,
    pools.token0 AS token0_denom,
        CASE
            WHEN (regexp_replace(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 1), '^\d+'::text, ''::text) = pools.token0) THEN ("substring"(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 1), '^\d+'::text))::numeric
            WHEN (regexp_replace(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 2), '^\d+'::text, ''::text) = pools.token0) THEN ("substring"(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 2), '^\d+'::text))::numeric
            ELSE NULL::numeric
        END AS token0_amount,
    pools.token1 AS token1_denom,
        CASE
            WHEN (regexp_replace(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 1), '^\d+'::text, ''::text) = pools.token1) THEN ("substring"(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 1), '^\d+'::text))::numeric
            WHEN (regexp_replace(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 2), '^\d+'::text, ''::text) = pools.token1) THEN ("substring"(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 2), '^\d+'::text))::numeric
            ELSE NULL::numeric
        END AS token1_amount,
    ((public.attributes(events.*) ->> 'share'::text))::numeric AS share,
    (public.attributes(events.*) ->> '_contract_address'::text) AS pool_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    events.data
   FROM (v1_cosmos.events
     JOIN v1_cosmos.pools ON ((pools.pool_address = (public.attributes(events.*) ->> '_contract_address'::text))))
  WHERE ((events.data ->> 'type'::text) = 'wasm-provide_liquidity'::text);


--
-- Name: blocks; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.blocks (
    chain_id integer NOT NULL,
    hash text NOT NULL,
    height bigint NOT NULL,
    "time" timestamp with time zone NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: TABLE blocks; Type: COMMENT; Schema: v1_cosmos; Owner: -
--

COMMENT ON TABLE v1_cosmos.blocks IS 'DEPRECATED: use V1';


--
-- Name: contracts; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.contracts (
    internal_chain_id integer NOT NULL,
    address text NOT NULL,
    start_height bigint NOT NULL,
    end_height bigint DEFAULT '9223372036854775807'::bigint NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: incentivize; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.incentivize AS
 SELECT (public.attributes(events.*) ->> 'lp_token'::text) AS lp_token,
    ((public.attributes(events.*) ->> 'start_ts'::text))::bigint AS start_ts,
    ((public.attributes(events.*) ->> 'end_ts'::text))::bigint AS end_ts,
    (public.attributes(events.*) ->> 'reward'::text) AS reward,
    ((public.attributes(events.*) ->> 'rps'::text))::numeric AS rewards_per_second,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    NULL::integer AS transaction_event_index,
    events.data
   FROM v1_cosmos.events
  WHERE ((events.data ->> 'type'::text) = 'wasm-incentivize'::text);


--
-- Name: pool_lp_token; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.pool_lp_token (
    id bigint NOT NULL,
    pool text NOT NULL,
    lp_token text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE pool_lp_token; Type: COMMENT; Schema: v1_cosmos; Owner: -
--

COMMENT ON TABLE v1_cosmos.pool_lp_token IS 'indexes the relation between the pool and lp tokens';


--
-- Name: swap; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.swap AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    (public.attributes(events.*) ->> 'receiver'::text) AS receiver,
    (public.attributes(events.*) ->> 'ask_asset'::text) AS ask_asset,
    ((public.attributes(events.*) ->> 'commission_amount'::text))::numeric AS commission_amount,
    ((public.attributes(events.*) ->> 'fee_share_amount'::text))::numeric AS fee_share_amount,
    ((public.attributes(events.*) ->> 'maker_fee_amount'::text))::numeric AS maker_fee_amount,
    ((public.attributes(events.*) ->> 'offer_amount'::text))::numeric AS offer_amount,
    (public.attributes(events.*) ->> 'offer_asset'::text) AS offer_asset,
    ((public.attributes(events.*) ->> 'return_amount'::text))::numeric AS return_amount,
    ((public.attributes(events.*) ->> 'spread_amount'::text))::numeric AS spread_amount,
    (public.attributes(events.*) ->> '_contract_address'::text) AS pool_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    NULL::integer AS transaction_event_index,
    events.data
   FROM v1_cosmos.events
  WHERE ((events.data ->> 'type'::text) = 'wasm-swap'::text);


--
-- Name: withdraw_liquidity; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.withdraw_liquidity AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    COALESCE((public.attributes(events.*) ->> 'receiver'::text), (public.attributes(events.*) ->> 'sender'::text)) AS receiver,
    regexp_replace(split_part((public.attributes(events.*) ->> 'refund_assets'::text), ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom,
    ((regexp_matches((public.attributes(events.*) ->> 'refund_assets'::text), '^\d+'::text))[1])::numeric AS token0_amount,
    regexp_replace(split_part((public.attributes(events.*) ->> 'refund_assets'::text), ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom,
    ((regexp_matches(split_part((public.attributes(events.*) ->> 'refund_assets'::text), ', '::text, 2), '^\d+'::text))[1])::numeric AS token1_amount,
    ((public.attributes(events.*) ->> 'withdrawn_share'::text))::numeric AS share,
    ( SELECT plt.pool
           FROM v1_cosmos.pool_lp_token plt
          WHERE ((plt.pool = (public.attributes(events.*) ->> '_contract_address'::text)) OR (plt.lp_token = (public.attributes(events.*) ->> '_contract_address'::text)))
         LIMIT 1) AS pool_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    events.data
   FROM v1_cosmos.events
  WHERE ((events.data ->> 'type'::text) = 'wasm-withdraw_liquidity'::text);


--
-- Name: pool_balance; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.pool_balance AS
 WITH all_heights AS (
         SELECT DISTINCT all_events.pool_address,
            all_events.height
           FROM ( SELECT add_liquidity.pool_address,
                    add_liquidity.height
                   FROM v1_cosmos.add_liquidity
                UNION ALL
                 SELECT withdraw_liquidity.pool_address,
                    withdraw_liquidity.height
                   FROM v1_cosmos.withdraw_liquidity
                UNION ALL
                 SELECT swap.pool_address,
                    swap.height
                   FROM v1_cosmos.swap) all_events
        ), add_liquidity AS (
         SELECT add_liquidity.pool_address,
            add_liquidity.token0_denom,
            sum(add_liquidity.token0_amount) OVER (PARTITION BY add_liquidity.pool_address, add_liquidity.token0_denom ORDER BY add_liquidity.height) AS total_token0_added,
            add_liquidity.token1_denom,
            sum(add_liquidity.token1_amount) OVER (PARTITION BY add_liquidity.pool_address, add_liquidity.token1_denom ORDER BY add_liquidity.height) AS total_token1_added,
            sum(add_liquidity.share) OVER (PARTITION BY add_liquidity.pool_address ORDER BY add_liquidity.height) AS total_share_added,
            add_liquidity.height
           FROM v1_cosmos.add_liquidity
        ), withdraw_liquidity AS (
         SELECT withdraw_liquidity.pool_address,
            withdraw_liquidity.token0_denom,
            sum(withdraw_liquidity.token0_amount) OVER (PARTITION BY withdraw_liquidity.pool_address, withdraw_liquidity.token0_denom ORDER BY withdraw_liquidity.height) AS total_token0_withdrawn,
            withdraw_liquidity.token1_denom,
            sum(withdraw_liquidity.token1_amount) OVER (PARTITION BY withdraw_liquidity.pool_address, withdraw_liquidity.token1_denom ORDER BY withdraw_liquidity.height) AS total_token1_withdrawn,
            sum(withdraw_liquidity.share) OVER (PARTITION BY withdraw_liquidity.pool_address ORDER BY withdraw_liquidity.height) AS total_share_withdrawn,
            withdraw_liquidity.height
           FROM v1_cosmos.withdraw_liquidity
        ), swap_impact AS (
         SELECT s_1.pool_address,
            s_1.height,
                CASE
                    WHEN (s_1.offer_asset = p.token0) THEN s_1.offer_amount
                    WHEN (s_1.ask_asset = p.token0) THEN (((s_1.return_amount * ('-1'::integer)::numeric) - COALESCE(s_1.fee_share_amount, (0)::numeric)) - COALESCE(s_1.maker_fee_amount, (0)::numeric))
                    ELSE (0)::numeric
                END AS token0_swap_impact,
                CASE
                    WHEN (s_1.offer_asset = p.token1) THEN s_1.offer_amount
                    WHEN (s_1.ask_asset = p.token1) THEN (((s_1.return_amount * ('-1'::integer)::numeric) - COALESCE(s_1.fee_share_amount, (0)::numeric)) - COALESCE(s_1.maker_fee_amount, (0)::numeric))
                    ELSE (0)::numeric
                END AS token1_swap_impact
           FROM (v1_cosmos.swap s_1
             JOIN ( SELECT DISTINCT pools.pool_address,
                    pools.token0,
                    pools.token1
                   FROM v1_cosmos.pools) p ON ((s_1.pool_address = p.pool_address)))
        ), swap_totals AS (
         SELECT swap_impact.pool_address,
            sum(swap_impact.token0_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token0_swap_impact,
            sum(swap_impact.token1_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token1_swap_impact,
            swap_impact.height
           FROM swap_impact
        )
 SELECT h.pool_address,
    a.token0_denom,
    ((COALESCE(a.total_token0_added, (0)::numeric) - COALESCE(w.total_token0_withdrawn, (0)::numeric)) + COALESCE(s.total_token0_swap_impact, (0)::numeric)) AS token0_balance,
    a.token1_denom,
    ((COALESCE(a.total_token1_added, (0)::numeric) - COALESCE(w.total_token1_withdrawn, (0)::numeric)) + COALESCE(s.total_token1_swap_impact, (0)::numeric)) AS token1_balance,
    (COALESCE(a.total_share_added, (0)::numeric) - COALESCE(w.total_share_withdrawn, (0)::numeric)) AS share,
    h.height
   FROM (((all_heights h
     LEFT JOIN add_liquidity a ON (((h.pool_address = a.pool_address) AND (h.height >= a.height) AND (a.height = ( SELECT max(add_liquidity.height) AS max
           FROM add_liquidity
          WHERE ((add_liquidity.pool_address = h.pool_address) AND (add_liquidity.height <= h.height)))))))
     LEFT JOIN withdraw_liquidity w ON (((h.pool_address = w.pool_address) AND (h.height >= w.height) AND (w.height = ( SELECT max(withdraw_liquidity.height) AS max
           FROM withdraw_liquidity
          WHERE ((withdraw_liquidity.pool_address = h.pool_address) AND (withdraw_liquidity.height <= h.height)))))))
     LEFT JOIN swap_totals s ON (((h.pool_address = s.pool_address) AND (h.height >= s.height) AND (s.height = ( SELECT max(swap_totals.height) AS max
           FROM swap_totals
          WHERE ((swap_totals.pool_address = h.pool_address) AND (swap_totals.height <= h.height)))))));


--
-- Name: token; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.token (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    coingecko_id text NOT NULL,
    denomination text,
    token_name text,
    chain_id integer,
    decimals smallint
);


--
-- Name: TABLE token; Type: COMMENT; Schema: v1_cosmos; Owner: -
--

COMMENT ON TABLE v1_cosmos.token IS 'contains the onchain representation of a token on babylon, aswell as the full token name and the coingecko id';


--
-- Name: token_prices; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.token_prices (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    price numeric,
    last_updated_at numeric,
    token text
);


--
-- Name: historic_pool_yield; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.historic_pool_yield AS
 WITH block_data AS (
         SELECT b.height,
            b."time" AS "timestamp",
            lead(b."time") OVER (ORDER BY b.height) AS next_timestamp,
            lead(b.height) OVER (ORDER BY b.height) AS next_height
           FROM v1_cosmos.blocks b
        ), token_prices_by_block AS (
         SELECT bd_1.height,
            bd_1."timestamp",
            bd_1.next_timestamp,
            bd_1.next_height,
            EXTRACT(epoch FROM (bd_1.next_timestamp - bd_1."timestamp")) AS seconds_between_blocks,
            t.denomination,
            tp.price,
            t.decimals,
            t.token_name
           FROM (((block_data bd_1
             CROSS JOIN LATERAL ( SELECT DISTINCT token_prices.token
                   FROM v1_cosmos.token_prices) d)
             LEFT JOIN LATERAL ( SELECT token_prices.token,
                    token_prices.price
                   FROM v1_cosmos.token_prices
                  WHERE (token_prices.token = d.token)
                  ORDER BY (abs(EXTRACT(epoch FROM (bd_1."timestamp" - token_prices.created_at))))
                 LIMIT 1) tp ON (true))
             LEFT JOIN v1_cosmos.token t ON ((tp.token = t.token_name)))
          WHERE (bd_1.next_height IS NOT NULL)
        ), block_fees AS (
         SELECT s.height,
            s.pool_address,
            s.ask_asset AS fee_token_denom,
            sum(s.commission_amount) AS fee_amount,
            (sum(((s.commission_amount)::double precision / power((10)::double precision, (COALESCE((tp.decimals)::integer, 6))::double precision))) * (COALESCE(tp.price, (0)::numeric))::double precision) AS fees_usd
           FROM (v1_cosmos.swap s
             LEFT JOIN token_prices_by_block tp ON (((s.height = tp.height) AND (s.ask_asset = tp.denomination))))
          GROUP BY s.height, s.pool_address, s.ask_asset, tp.price, tp.decimals
        ), block_incentives AS (
         SELECT bp.height,
            i.lp_token,
            i.reward AS incentive_token_denom,
            sum((i.rewards_per_second * tp.seconds_between_blocks)) AS incentive_amount,
            (sum((((i.rewards_per_second * tp.seconds_between_blocks))::double precision / power((10)::double precision, (COALESCE((tp.decimals)::integer, 6))::double precision))) * (COALESCE(tp.price, (0)::numeric))::double precision) AS incentives_usd
           FROM ((block_data bp
             JOIN v1_cosmos.incentivize i ON ((((i.start_ts)::numeric <= EXTRACT(epoch FROM bp."timestamp")) AND ((i.end_ts)::numeric >= EXTRACT(epoch FROM bp."timestamp")))))
             LEFT JOIN token_prices_by_block tp ON (((bp.height = tp.height) AND (i.reward = tp.denomination))))
          GROUP BY bp.height, i.lp_token, i.reward, tp.seconds_between_blocks, tp.price, tp.decimals
        ), pool_info AS (
         SELECT DISTINCT pool_balance.pool_address,
            ((pool_balance.token0_denom || ':'::text) || pool_balance.token1_denom) AS lp_token
           FROM v1_cosmos.pool_balance
        ), pool_liquidity AS (
         SELECT h.height,
            a.pool_address,
            a.token0_denom,
            a.token1_denom,
            a.token0_balance,
            a.token1_balance,
            (((a.token0_balance)::double precision / power((10)::double precision, (COALESCE((tp0.decimals)::integer, 6))::double precision)) * (COALESCE(tp0.price, (0)::numeric))::double precision) AS token0_value_usd,
            (((a.token1_balance)::double precision / power((10)::double precision, (COALESCE((tp1.decimals)::integer, 6))::double precision)) * (COALESCE(tp1.price, (0)::numeric))::double precision) AS token1_value_usd,
            ((((a.token0_balance)::double precision / power((10)::double precision, (COALESCE((tp0.decimals)::integer, 6))::double precision)) * (COALESCE(tp0.price, (0)::numeric))::double precision) + (((a.token1_balance)::double precision / power((10)::double precision, (COALESCE((tp1.decimals)::integer, 6))::double precision)) * (COALESCE(tp1.price, (0)::numeric))::double precision)) AS total_liquidity_usd
           FROM (((v1_cosmos.blocks h
             JOIN v1_cosmos.pool_balance a ON ((h.height = a.height)))
             LEFT JOIN token_prices_by_block tp0 ON (((h.height = tp0.height) AND (a.token0_denom = tp0.denomination))))
             LEFT JOIN token_prices_by_block tp1 ON (((h.height = tp1.height) AND (a.token1_denom = tp1.denomination))))
        ), total_fees_by_pool AS (
         SELECT block_fees.height,
            block_fees.pool_address,
            json_agg(json_build_object('denom', block_fees.fee_token_denom, 'amount', block_fees.fee_amount, 'usd_value', block_fees.fees_usd)) AS fee_tokens,
            sum(block_fees.fees_usd) AS total_fees_usd
           FROM block_fees
          GROUP BY block_fees.height, block_fees.pool_address
        ), total_incentives_by_pool AS (
         SELECT bi.height,
            pi.pool_address,
            json_agg(json_build_object('denom', bi.incentive_token_denom, 'amount', bi.incentive_amount, 'usd_value', bi.incentives_usd)) AS incentive_tokens,
            sum(bi.incentives_usd) AS total_incentives_usd
           FROM (block_incentives bi
             LEFT JOIN pool_info pi ON ((bi.lp_token = pi.lp_token)))
          GROUP BY bi.height, pi.pool_address
        )
 SELECT bd.height,
    bd."timestamp",
    pl.pool_address,
    pl.token0_denom,
    pl.token1_denom,
    pl.token0_balance,
    pl.token1_balance,
    pl.token0_value_usd,
    pl.token1_value_usd,
    pl.total_liquidity_usd,
    tf.fee_tokens,
    COALESCE(tf.total_fees_usd, (0)::double precision) AS fees_usd,
    ti.incentive_tokens,
    COALESCE(ti.total_incentives_usd, (0)::double precision) AS incentives_usd,
    (COALESCE(tf.total_fees_usd, (0)::double precision) + COALESCE(ti.total_incentives_usd, (0)::double precision)) AS total_earnings_usd
   FROM (((block_data bd
     JOIN pool_liquidity pl ON ((bd.height = pl.height)))
     LEFT JOIN total_fees_by_pool tf ON (((bd.height = tf.height) AND (pl.pool_address = tf.pool_address))))
     LEFT JOIN total_incentives_by_pool ti ON (((bd.height = ti.height) AND (pl.pool_address = ti.pool_address))))
  WHERE (bd.next_height IS NOT NULL)
  ORDER BY bd.height, pl.pool_address;


--
-- Name: materialized_pools; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_pools AS
 WITH create_pair AS (
         SELECT (public.attributes(events.*) ->> 'action'::text) AS action,
            (public.attributes(events.*) ->> 'pair'::text) AS pair,
            (public.attributes(events.*) ->> '_contract_address'::text) AS factory_address,
            (public.attributes(events.*) ->> 'msg_index'::text) AS msg_index,
            events.chain_id AS internal_chain_id,
            events.block_hash,
            events.height,
            events.index,
            events."time" AS "timestamp",
            events.transaction_hash,
            events.transaction_index,
            NULL::integer AS transaction_event_index,
            events.data
           FROM v1_cosmos.events
          WHERE ((events.data ->> 'type'::text) = 'wasm-create_pair'::text)
        ), register AS (
         SELECT (public.attributes(events.*) ->> 'action'::text) AS action,
            (public.attributes(events.*) ->> 'pair_contract_addr'::text) AS pair_contract_addr,
            (public.attributes(events.*) ->> '_contract_address'::text) AS factory_address,
            (public.attributes(events.*) ->> 'msg_index'::text) AS msg_index,
            events.chain_id AS internal_chain_id,
            events.block_hash,
            events.height,
            events.index,
            events."time" AS "timestamp",
            events.transaction_hash,
            events.transaction_index,
            NULL::integer AS transaction_event_index,
            events.data
           FROM v1_cosmos.events
          WHERE ((events.data ->> 'type'::text) = 'wasm-register'::text)
        )
 SELECT split_part(cp.pair, '-'::text, 1) AS token0,
    split_part(cp.pair, '-'::text, 2) AS token1,
    r.pair_contract_addr AS pool_address,
    (cp.msg_index)::integer AS msg_index,
    cp.internal_chain_id,
    cp.block_hash,
    cp.height,
    cp.index AS create_index,
    r.index AS register_index,
    cp."timestamp",
    cp.transaction_hash,
    cp.transaction_index AS create_transaction_index,
    r.transaction_index AS register_transaction_index
   FROM (create_pair cp
     JOIN register r ON ((cp.transaction_hash = r.transaction_hash)))
  WITH NO DATA;


--
-- Name: materialized_add_liquidity; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_add_liquidity AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    (public.attributes(events.*) ->> 'receiver'::text) AS receiver,
    materialized_pools.token0 AS token0_denom,
        CASE
            WHEN (regexp_replace(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 1), '^\d+'::text, ''::text) = materialized_pools.token0) THEN ("substring"(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 1), '^\d+'::text))::numeric
            WHEN (regexp_replace(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 2), '^\d+'::text, ''::text) = materialized_pools.token0) THEN ("substring"(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 2), '^\d+'::text))::numeric
            ELSE NULL::numeric
        END AS token0_amount,
    materialized_pools.token1 AS token1_denom,
        CASE
            WHEN (regexp_replace(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 1), '^\d+'::text, ''::text) = materialized_pools.token1) THEN ("substring"(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 1), '^\d+'::text))::numeric
            WHEN (regexp_replace(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 2), '^\d+'::text, ''::text) = materialized_pools.token1) THEN ("substring"(split_part((public.attributes(events.*) ->> 'assets'::text), ', '::text, 2), '^\d+'::text))::numeric
            ELSE NULL::numeric
        END AS token1_amount,
    ((public.attributes(events.*) ->> 'share'::text))::numeric AS share,
    (public.attributes(events.*) ->> '_contract_address'::text) AS pool_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    events.data
   FROM (v1_cosmos.events
     JOIN v1_cosmos.materialized_pools ON ((materialized_pools.pool_address = (public.attributes(events.*) ->> '_contract_address'::text))))
  WHERE ((events.data ->> 'type'::text) = 'wasm-provide_liquidity'::text)
  WITH NO DATA;


--
-- Name: materialized_add_liquidity_totals; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_add_liquidity_totals AS
 SELECT materialized_add_liquidity.pool_address,
    materialized_add_liquidity.token0_denom,
    sum(materialized_add_liquidity.token0_amount) OVER (PARTITION BY materialized_add_liquidity.pool_address, materialized_add_liquidity.token0_denom ORDER BY materialized_add_liquidity.height) AS total_token0_added,
    materialized_add_liquidity.token1_denom,
    sum(materialized_add_liquidity.token1_amount) OVER (PARTITION BY materialized_add_liquidity.pool_address, materialized_add_liquidity.token1_denom ORDER BY materialized_add_liquidity.height) AS total_token1_added,
    sum(materialized_add_liquidity.share) OVER (PARTITION BY materialized_add_liquidity.pool_address ORDER BY materialized_add_liquidity.height) AS total_share_added,
    materialized_add_liquidity.height
   FROM v1_cosmos.materialized_add_liquidity
  WITH NO DATA;


--
-- Name: materialized_swap; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_swap AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    (public.attributes(events.*) ->> 'receiver'::text) AS receiver,
    (public.attributes(events.*) ->> 'ask_asset'::text) AS ask_asset,
    ((public.attributes(events.*) ->> 'commission_amount'::text))::numeric AS commission_amount,
    ((public.attributes(events.*) ->> 'fee_share_amount'::text))::numeric AS fee_share_amount,
    ((public.attributes(events.*) ->> 'maker_fee_amount'::text))::numeric AS maker_fee_amount,
    ((public.attributes(events.*) ->> 'offer_amount'::text))::numeric AS offer_amount,
    (public.attributes(events.*) ->> 'offer_asset'::text) AS offer_asset,
    ((public.attributes(events.*) ->> 'return_amount'::text))::numeric AS return_amount,
    ((public.attributes(events.*) ->> 'spread_amount'::text))::numeric AS spread_amount,
    (public.attributes(events.*) ->> '_contract_address'::text) AS pool_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    NULL::integer AS transaction_event_index,
    events.data
   FROM v1_cosmos.events
  WHERE ((events.data ->> 'type'::text) = 'wasm-swap'::text)
  WITH NO DATA;


--
-- Name: materialized_withdraw_liquidity; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_withdraw_liquidity AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    COALESCE((public.attributes(events.*) ->> 'receiver'::text), (public.attributes(events.*) ->> 'sender'::text)) AS receiver,
    regexp_replace(split_part((public.attributes(events.*) ->> 'refund_assets'::text), ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom,
    ((regexp_matches((public.attributes(events.*) ->> 'refund_assets'::text), '^\d+'::text))[1])::numeric AS token0_amount,
    regexp_replace(split_part((public.attributes(events.*) ->> 'refund_assets'::text), ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom,
    ((regexp_matches(split_part((public.attributes(events.*) ->> 'refund_assets'::text), ', '::text, 2), '^\d+'::text))[1])::numeric AS token1_amount,
    ((public.attributes(events.*) ->> 'withdrawn_share'::text))::numeric AS share,
    ( SELECT plt.pool
           FROM v1_cosmos.pool_lp_token plt
          WHERE ((plt.pool = (public.attributes(events.*) ->> '_contract_address'::text)) OR (plt.lp_token = (public.attributes(events.*) ->> '_contract_address'::text)))
         LIMIT 1) AS pool_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    events.data
   FROM v1_cosmos.events
  WHERE ((events.data ->> 'type'::text) = 'wasm-withdraw_liquidity'::text)
  WITH NO DATA;


--
-- Name: materialized_all_heights; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_all_heights AS
 SELECT DISTINCT all_events.pool_address,
    all_events.height
   FROM ( SELECT materialized_add_liquidity.pool_address,
            materialized_add_liquidity.height
           FROM v1_cosmos.materialized_add_liquidity
        UNION ALL
         SELECT materialized_withdraw_liquidity.pool_address,
            materialized_withdraw_liquidity.height
           FROM v1_cosmos.materialized_withdraw_liquidity
        UNION ALL
         SELECT materialized_swap.pool_address,
            materialized_swap.height
           FROM v1_cosmos.materialized_swap) all_events
  WITH NO DATA;


--
-- Name: materialized_block_data; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_block_data AS
 SELECT b.height,
    b."time" AS "timestamp",
    lead(b."time") OVER (ORDER BY b.height) AS next_timestamp,
    lead(b.height) OVER (ORDER BY b.height) AS next_height
   FROM v1_cosmos.blocks b
  WITH NO DATA;


--
-- Name: token_prices_by_block; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.token_prices_by_block (
    height bigint NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    next_timestamp timestamp with time zone NOT NULL,
    next_height bigint NOT NULL,
    seconds_between_blocks numeric NOT NULL,
    denomination text NOT NULL,
    price numeric NOT NULL,
    decimals smallint NOT NULL,
    token_name text NOT NULL
);


--
-- Name: materialized_block_fees; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_block_fees AS
 SELECT s.height,
    s.pool_address,
    s.ask_asset AS fee_token_denom,
    sum(s.commission_amount) AS fee_amount,
    (sum(((s.commission_amount)::double precision / power((10)::double precision, (COALESCE((tp.decimals)::integer, 6))::double precision))) * (COALESCE(tp.price, (0)::numeric))::double precision) AS fees_usd
   FROM (v1_cosmos.materialized_swap s
     LEFT JOIN v1_cosmos.token_prices_by_block tp ON (((s.height = tp.height) AND (s.ask_asset = tp.denomination))))
  GROUP BY s.height, s.pool_address, s.ask_asset, tp.price, tp.decimals
  WITH NO DATA;


--
-- Name: materialized_incentivize; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_incentivize AS
 SELECT (public.attributes(events.*) ->> 'lp_token'::text) AS lp_token,
    ((public.attributes(events.*) ->> 'start_ts'::text))::bigint AS start_ts,
    ((public.attributes(events.*) ->> 'end_ts'::text))::bigint AS end_ts,
    (public.attributes(events.*) ->> 'reward'::text) AS reward,
    ((public.attributes(events.*) ->> 'rps'::text))::numeric AS rewards_per_second,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    NULL::integer AS transaction_event_index,
    events.data
   FROM v1_cosmos.events
  WHERE ((events.data ->> 'type'::text) = 'wasm-incentivize'::text)
  WITH NO DATA;


--
-- Name: materialized_block_incentives; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_block_incentives AS
 SELECT bp.height,
    i.lp_token,
    i.reward AS incentive_token_denom,
    sum((i.rewards_per_second * tp.seconds_between_blocks)) AS incentive_amount,
    (sum((((i.rewards_per_second * tp.seconds_between_blocks))::double precision / power((10)::double precision, (COALESCE((tp.decimals)::integer, 6))::double precision))) * (COALESCE(tp.price, (0)::numeric))::double precision) AS incentives_usd
   FROM ((v1_cosmos.materialized_block_data bp
     JOIN v1_cosmos.materialized_incentivize i ON ((((i.start_ts)::numeric <= EXTRACT(epoch FROM bp."timestamp")) AND ((i.end_ts)::numeric >= EXTRACT(epoch FROM bp."timestamp")))))
     LEFT JOIN v1_cosmos.token_prices_by_block tp ON (((bp.height = tp.height) AND (i.reward = tp.denomination))))
  GROUP BY bp.height, i.lp_token, i.reward, tp.seconds_between_blocks, tp.price, tp.decimals
  WITH NO DATA;


--
-- Name: materialized_swap_totals; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_swap_totals AS
 WITH swap_impact AS (
         SELECT s_1.pool_address,
            s_1.height,
                CASE
                    WHEN (s_1.offer_asset = p.token0) THEN s_1.offer_amount
                    WHEN (s_1.ask_asset = p.token0) THEN (((s_1.return_amount * ('-1'::integer)::numeric) - COALESCE(s_1.fee_share_amount, (0)::numeric)) - COALESCE(s_1.maker_fee_amount, (0)::numeric))
                    ELSE (0)::numeric
                END AS token0_swap_impact,
                CASE
                    WHEN (s_1.offer_asset = p.token1) THEN s_1.offer_amount
                    WHEN (s_1.ask_asset = p.token1) THEN (((s_1.return_amount * ('-1'::integer)::numeric) - COALESCE(s_1.fee_share_amount, (0)::numeric)) - COALESCE(s_1.maker_fee_amount, (0)::numeric))
                    ELSE (0)::numeric
                END AS token1_swap_impact
           FROM (v1_cosmos.materialized_swap s_1
             JOIN ( SELECT DISTINCT materialized_pools.pool_address,
                    materialized_pools.token0,
                    materialized_pools.token1
                   FROM v1_cosmos.materialized_pools) p ON ((s_1.pool_address = p.pool_address)))
        )
 SELECT swap_impact.pool_address,
    sum(swap_impact.token0_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token0_swap_impact,
    sum(swap_impact.token1_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token1_swap_impact,
    swap_impact.height
   FROM swap_impact
  WITH NO DATA;


--
-- Name: materialized_withdraw_liquidity_totals; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_withdraw_liquidity_totals AS
 SELECT materialized_withdraw_liquidity.pool_address,
    materialized_withdraw_liquidity.token0_denom,
    sum(materialized_withdraw_liquidity.token0_amount) OVER (PARTITION BY materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.token0_denom ORDER BY materialized_withdraw_liquidity.height) AS total_token0_withdrawn,
    materialized_withdraw_liquidity.token1_denom,
    sum(materialized_withdraw_liquidity.token1_amount) OVER (PARTITION BY materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.token1_denom ORDER BY materialized_withdraw_liquidity.height) AS total_token1_withdrawn,
    sum(materialized_withdraw_liquidity.share) OVER (PARTITION BY materialized_withdraw_liquidity.pool_address ORDER BY materialized_withdraw_liquidity.height) AS total_share_withdrawn,
    materialized_withdraw_liquidity.height
   FROM v1_cosmos.materialized_withdraw_liquidity
  WITH NO DATA;


--
-- Name: materialized_pool_balance; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_pool_balance AS
 SELECT h.pool_address,
    a.token0_denom,
    ((COALESCE(a.total_token0_added, (0)::numeric) - COALESCE(w.total_token0_withdrawn, (0)::numeric)) + COALESCE(s.total_token0_swap_impact, (0)::numeric)) AS token0_balance,
    a.token1_denom,
    ((COALESCE(a.total_token1_added, (0)::numeric) - COALESCE(w.total_token1_withdrawn, (0)::numeric)) + COALESCE(s.total_token1_swap_impact, (0)::numeric)) AS token1_balance,
    (COALESCE(a.total_share_added, (0)::numeric) - COALESCE(w.total_share_withdrawn, (0)::numeric)) AS share,
    h.height
   FROM (((v1_cosmos.materialized_all_heights h
     LEFT JOIN LATERAL ( SELECT a_1.pool_address,
            a_1.token0_denom,
            a_1.total_token0_added,
            a_1.token1_denom,
            a_1.total_token1_added,
            a_1.total_share_added,
            a_1.height
           FROM v1_cosmos.materialized_add_liquidity_totals a_1
          WHERE ((a_1.pool_address = h.pool_address) AND (a_1.height <= h.height))
          ORDER BY a_1.height DESC
         LIMIT 1) a ON (true))
     LEFT JOIN LATERAL ( SELECT w_1.pool_address,
            w_1.token0_denom,
            w_1.total_token0_withdrawn,
            w_1.token1_denom,
            w_1.total_token1_withdrawn,
            w_1.total_share_withdrawn,
            w_1.height
           FROM v1_cosmos.materialized_withdraw_liquidity_totals w_1
          WHERE ((w_1.pool_address = h.pool_address) AND (w_1.height <= h.height))
          ORDER BY w_1.height DESC
         LIMIT 1) w ON (true))
     LEFT JOIN LATERAL ( SELECT s_1.pool_address,
            s_1.total_token0_swap_impact,
            s_1.total_token1_swap_impact,
            s_1.height
           FROM v1_cosmos.materialized_swap_totals s_1
          WHERE ((s_1.pool_address = h.pool_address) AND (s_1.height <= h.height))
          ORDER BY s_1.height DESC
         LIMIT 1) s ON (true))
  WITH NO DATA;


--
-- Name: materialized_pool_fee_totals; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_pool_fee_totals AS
 SELECT materialized_block_fees.height,
    materialized_block_fees.pool_address,
    json_agg(json_build_object('denom', materialized_block_fees.fee_token_denom, 'amount', materialized_block_fees.fee_amount, 'usd_value', materialized_block_fees.fees_usd)) AS fee_tokens,
    sum(materialized_block_fees.fees_usd) AS total_fees_usd
   FROM v1_cosmos.materialized_block_fees
  GROUP BY materialized_block_fees.height, materialized_block_fees.pool_address
  WITH NO DATA;


--
-- Name: materialized_pool_incentive_totals; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_pool_incentive_totals AS
 WITH pool_info AS (
         SELECT DISTINCT pool_lp_token.pool AS pool_address,
            pool_lp_token.lp_token
           FROM v1_cosmos.pool_lp_token
        )
 SELECT bi.height,
    pi.pool_address,
    json_agg(json_build_object('denom', bi.incentive_token_denom, 'amount', bi.incentive_amount, 'usd_value', bi.incentives_usd)) AS incentive_tokens,
    sum(bi.incentives_usd) AS total_incentives_usd
   FROM (v1_cosmos.materialized_block_incentives bi
     JOIN pool_info pi ON ((bi.lp_token = pi.lp_token)))
  GROUP BY bi.height, pi.pool_address
  WITH NO DATA;


--
-- Name: materialized_pool_liquidity; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_pool_liquidity AS
 SELECT h.height,
    a.pool_address,
    a.token0_denom,
    a.token1_denom,
    a.token0_balance,
    a.token1_balance,
    (((a.token0_balance)::double precision / power((10)::double precision, (COALESCE((tp0.decimals)::integer, 6))::double precision)) * (COALESCE(tp0.price, (0)::numeric))::double precision) AS token0_value_usd,
    (((a.token1_balance)::double precision / power((10)::double precision, (COALESCE((tp1.decimals)::integer, 6))::double precision)) * (COALESCE(tp1.price, (0)::numeric))::double precision) AS token1_value_usd,
    ((((a.token0_balance)::double precision / power((10)::double precision, (COALESCE((tp0.decimals)::integer, 6))::double precision)) * (COALESCE(tp0.price, (0)::numeric))::double precision) + (((a.token1_balance)::double precision / power((10)::double precision, (COALESCE((tp1.decimals)::integer, 6))::double precision)) * (COALESCE(tp1.price, (0)::numeric))::double precision)) AS total_liquidity_usd
   FROM (((v1_cosmos.blocks h
     JOIN v1_cosmos.materialized_pool_balance a ON ((h.height = a.height)))
     LEFT JOIN v1_cosmos.token_prices_by_block tp0 ON (((h.height = tp0.height) AND (a.token0_denom = tp0.denomination))))
     LEFT JOIN v1_cosmos.token_prices_by_block tp1 ON (((h.height = tp1.height) AND (a.token1_denom = tp1.denomination))))
  WITH NO DATA;


--
-- Name: materialized_historic_pool_yield; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_historic_pool_yield AS
 SELECT bd.height,
    bd."timestamp",
    pl.pool_address,
    pl.token0_denom,
    pl.token1_denom,
    pl.token0_balance,
    pl.token1_balance,
    pl.token0_value_usd,
    pl.token1_value_usd,
    pl.total_liquidity_usd,
    tf.fee_tokens,
    COALESCE(tf.total_fees_usd, (0)::double precision) AS fees_usd,
    ti.incentive_tokens,
    COALESCE(ti.total_incentives_usd, (0)::double precision) AS incentives_usd,
    (COALESCE(tf.total_fees_usd, (0)::double precision) + COALESCE(ti.total_incentives_usd, (0)::double precision)) AS total_earnings_usd
   FROM (((v1_cosmos.materialized_block_data bd
     JOIN v1_cosmos.materialized_pool_liquidity pl ON ((bd.height = pl.height)))
     LEFT JOIN v1_cosmos.materialized_pool_fee_totals tf ON (((bd.height = tf.height) AND (pl.pool_address = tf.pool_address))))
     LEFT JOIN v1_cosmos.materialized_pool_incentive_totals ti ON (((bd.height = ti.height) AND (pl.pool_address = ti.pool_address))))
  WHERE (bd.next_height IS NOT NULL)
  ORDER BY bd.height, pl.pool_address
  WITH NO DATA;


--
-- Name: pool_incentive_multipliers; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.pool_incentive_multipliers (
    id bigint NOT NULL,
    pool_address text NOT NULL,
    origin text NOT NULL,
    multiplier numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE pool_incentive_multipliers; Type: COMMENT; Schema: v1_cosmos; Owner: -
--

COMMENT ON TABLE v1_cosmos.pool_incentive_multipliers IS 'tracks the pool incentive multipliers by their origin (partner)';


--
-- Name: materialized_points; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_points AS
 WITH poolincentivemultiplierdefinitions AS (
         SELECT mp.pool_address,
            json_object_agg(pim.origin, pim.multiplier) AS incentive_multipliers
           FROM (v1_cosmos.materialized_pools mp
             JOIN v1_cosmos.pool_incentive_multipliers pim ON ((mp.pool_address = pim.pool_address)))
          GROUP BY mp.pool_address
        ), hourlyavgprices AS (
         SELECT tpb.denomination,
            date_trunc('hour'::text, tpb."timestamp") AS hour,
            avg(tpb.price) AS hourly_avg_price,
            min(tpb.height) AS start_height,
            max(tpb.height) AS end_height
           FROM v1_cosmos.token_prices_by_block tpb
          GROUP BY tpb.denomination, (date_trunc('hour'::text, tpb."timestamp"))
        ), hourlyliquidityadds AS (
         SELECT al.sender AS user_wallet,
            al.pool_address,
            al.token0_denom,
            al.token1_denom,
            date_trunc('hour'::text, al."timestamp") AS hour,
            sum(al.token0_amount) AS token0_amount,
            sum(al.token1_amount) AS token1_amount,
            min(al.height) AS start_height,
            max(al.height) AS end_height
           FROM v1_cosmos.materialized_add_liquidity al
          GROUP BY al.sender, al.pool_address, al.token0_denom, al.token1_denom, (date_trunc('hour'::text, al."timestamp"))
        ), hourlliquiditytotaladds AS (
         SELECT hal.user_wallet,
            hal.pool_address,
            hal.token0_denom,
            hal.token1_denom,
            hal.hour,
            sum(hal.token0_amount) OVER (PARTITION BY hal.user_wallet, hal.pool_address ORDER BY hal.hour) AS cumulative_token0_amount_added,
            sum(hal.token1_amount) OVER (PARTITION BY hal.user_wallet, hal.pool_address ORDER BY hal.hour) AS cumulative_token1_amount_added
           FROM hourlyliquidityadds hal
        ), hourlyliquiditysubs AS (
         SELECT wl.receiver AS user_wallet,
            wl.pool_address,
            wl.token0_denom,
            wl.token1_denom,
            date_trunc('hour'::text, wl."timestamp") AS hour,
            sum(wl.token0_amount) AS token0_amount,
            sum(wl.token1_amount) AS token1_amount,
            min(wl.height) AS start_height,
            max(wl.height) AS end_height
           FROM v1_cosmos.materialized_withdraw_liquidity wl
          GROUP BY wl.receiver, wl.pool_address, wl.token0_denom, wl.token1_denom, (date_trunc('hour'::text, wl."timestamp"))
        ), hourlyliquiditytotalsubs AS (
         SELECT hwl.user_wallet,
            hwl.pool_address,
            hwl.token0_denom,
            hwl.token1_denom,
            hwl.hour,
            sum(hwl.token0_amount) OVER (PARTITION BY hwl.user_wallet, hwl.pool_address ORDER BY hwl.hour) AS cumulative_token0_amount_withdrawn,
            sum(hwl.token1_amount) OVER (PARTITION BY hwl.user_wallet, hwl.pool_address ORDER BY hwl.hour) AS cumulative_token1_amount_withdrawn
           FROM hourlyliquiditysubs hwl
        ), combinedhourlyliquidityprices AS (
         SELECT all_hours.user_wallet,
            all_hours.pool_address,
            all_hours.hour,
            all_hours.token0_denom,
            all_hours.token1_denom,
            COALESCE(hal.cumulative_token0_amount_added, (0)::numeric) AS cumulative_token0_amount_added,
            COALESCE(hal.cumulative_token1_amount_added, (0)::numeric) AS cumulative_token1_amount_added,
            COALESCE(hwl.cumulative_token0_amount_withdrawn, (0)::numeric) AS cumulative_token0_amount_withdrawn,
            COALESCE(hwl.cumulative_token1_amount_withdrawn, (0)::numeric) AS cumulative_token1_amount_withdrawn
           FROM ((( SELECT base_data.user_wallet,
                    base_data.pool_address,
                    all_hours_1.hour,
                    base_data.token0_denom,
                    base_data.token1_denom
                   FROM (( SELECT DISTINCT hourlliquiditytotaladds.user_wallet,
                            hourlliquiditytotaladds.pool_address,
                            hourlliquiditytotaladds.token0_denom,
                            hourlliquiditytotaladds.token1_denom
                           FROM hourlliquiditytotaladds
                        UNION
                         SELECT DISTINCT hourlyliquiditytotalsubs.user_wallet,
                            hourlyliquiditytotalsubs.pool_address,
                            hourlyliquiditytotalsubs.token0_denom,
                            hourlyliquiditytotalsubs.token1_denom
                           FROM hourlyliquiditytotalsubs) base_data
                     CROSS JOIN ( SELECT DISTINCT hourlyavgprices.hour
                           FROM hourlyavgprices) all_hours_1)) all_hours
             LEFT JOIN hourlliquiditytotaladds hal ON (((all_hours.user_wallet = hal.user_wallet) AND (all_hours.pool_address = hal.pool_address) AND (all_hours.hour = hal.hour) AND (all_hours.token0_denom = hal.token0_denom) AND (all_hours.token1_denom = hal.token1_denom))))
             LEFT JOIN hourlyliquiditytotalsubs hwl ON (((all_hours.user_wallet = hwl.user_wallet) AND (all_hours.pool_address = hwl.pool_address) AND (all_hours.hour = hwl.hour) AND (all_hours.token0_denom = hwl.token0_denom) AND (all_hours.token1_denom = hwl.token1_denom))))
        ), hourlyusdliquidity AS (
         SELECT chl.user_wallet,
            chl.pool_address,
            chl.hour,
            chl.token0_denom,
            chl.token1_denom,
            chl.cumulative_token0_amount_added,
            chl.cumulative_token0_amount_withdrawn,
            (chl.cumulative_token0_amount_added - chl.cumulative_token0_amount_withdrawn) AS net_cumulative_token0_amount,
            ((((chl.cumulative_token0_amount_added - chl.cumulative_token0_amount_withdrawn))::double precision / power((10)::double precision, (t0.decimals)::double precision)) * (hap0.hourly_avg_price)::double precision) AS net_usd_cumulative_token0_amount,
            sum((chl.cumulative_token0_amount_added - chl.cumulative_token0_amount_withdrawn)) OVER (PARTITION BY chl.user_wallet, chl.pool_address ORDER BY chl.hour) AS net_token0_amount,
            hap0.hourly_avg_price AS t0_hourly_avg_price,
            (((sum((chl.cumulative_token0_amount_added - chl.cumulative_token0_amount_withdrawn)) OVER (PARTITION BY chl.user_wallet, chl.pool_address ORDER BY chl.hour))::double precision / power((10)::double precision, (t0.decimals)::double precision)) * (hap0.hourly_avg_price)::double precision) AS net_usd_token0_amount,
            chl.cumulative_token1_amount_added,
            chl.cumulative_token1_amount_withdrawn,
            (chl.cumulative_token1_amount_added - chl.cumulative_token1_amount_withdrawn) AS net_cumulative_token1_amount,
            hap1.hourly_avg_price,
            ((((chl.cumulative_token1_amount_added - chl.cumulative_token1_amount_withdrawn))::double precision / power((10)::double precision, (t1.decimals)::double precision)) * (hap1.hourly_avg_price)::double precision) AS net_usd_cumulative_token1_amount,
            sum((chl.cumulative_token1_amount_added - chl.cumulative_token1_amount_withdrawn)) OVER (PARTITION BY chl.user_wallet, chl.pool_address ORDER BY chl.hour) AS net_token1_amount,
            hap1.hourly_avg_price AS t1_hourly_avg_price,
            (((sum((chl.cumulative_token1_amount_added - chl.cumulative_token1_amount_withdrawn)) OVER (PARTITION BY chl.user_wallet, chl.pool_address ORDER BY chl.hour))::double precision / power((10)::double precision, (t1.decimals)::double precision)) * (hap1.hourly_avg_price)::double precision) AS net_usd_token1_amount
           FROM ((((combinedhourlyliquidityprices chl
             JOIN hourlyavgprices hap0 ON (((chl.hour = hap0.hour) AND (hap0.denomination = chl.token0_denom))))
             JOIN hourlyavgprices hap1 ON (((chl.hour = hap1.hour) AND (hap1.denomination = chl.token1_denom))))
             JOIN v1_cosmos.token t0 ON ((t0.denomination = chl.token0_denom)))
             JOIN v1_cosmos.token t1 ON ((t1.denomination = chl.token1_denom)))
        ), hourlypointscalculation AS (
         SELECT hul.user_wallet,
            hul.pool_address,
            hul.hour,
            hul.token0_denom,
            hul.token1_denom,
            COALESCE((hul.net_usd_token0_amount + hul.net_usd_token0_amount), (0)::double precision) AS total_usd_amount,
            json_build_object('tower', (GREATEST((0)::double precision, ((hul.net_usd_token0_amount + hul.net_usd_token1_amount) * (0.001)::double precision)) * (COALESCE(((pim.incentive_multipliers ->> 'tower'::text))::numeric, (0)::numeric))::double precision), 'escher', (GREATEST((0)::double precision, ((hul.net_usd_token0_amount + hul.net_usd_token1_amount) * (0.001)::double precision)) * (COALESCE(((pim.incentive_multipliers ->> 'escher'::text))::numeric, (0)::numeric))::double precision), 'union', (GREATEST((0)::double precision, ((hul.net_usd_token0_amount + hul.net_usd_token1_amount) * (0.001)::double precision)) * (COALESCE(((pim.incentive_multipliers ->> 'union'::text))::numeric, (0)::numeric))::double precision), 'satlayer', (GREATEST((0)::double precision, ((hul.net_usd_token0_amount + hul.net_usd_token1_amount) * (0.001)::double precision)) * (COALESCE(((pim.incentive_multipliers ->> 'satlayer'::text))::numeric, (0)::numeric))::double precision)) AS points
           FROM (hourlyusdliquidity hul
             JOIN poolincentivemultiplierdefinitions pim ON ((hul.pool_address = pim.pool_address)))
        ), finalliqduititypointscalculation AS (
         SELECT hpc.user_wallet,
            hpc.pool_address,
            rank() OVER (ORDER BY (sum(((hpc.points ->> 'tower'::text))::numeric)) DESC) AS liquidity_points_rank,
            sum(((hpc.points ->> 'tower'::text))::numeric) AS total_tower_points,
            sum(((hpc.points ->> 'escher'::text))::numeric) AS total_escher_points,
            sum(((hpc.points ->> 'union'::text))::numeric) AS total_union_points,
            sum(((hpc.points ->> 'satlayer'::text))::numeric) AS total_satlayer_points
           FROM hourlypointscalculation hpc
          GROUP BY hpc.user_wallet, hpc.pool_address
        ), hourlyswaps AS (
         SELECT s.receiver AS user_wallet,
            s.pool_address,
            s.ask_asset,
            date_trunc('hour'::text, s."timestamp") AS hour,
            sum((s.fee_share_amount + s.maker_fee_amount)) AS cumulative_fee_amount
           FROM v1_cosmos.materialized_swap s
          GROUP BY s.receiver, s.pool_address, s.ask_asset, (date_trunc('hour'::text, s."timestamp"))
        ), combinedhourlyswapprices AS (
         SELECT hourlyswaps.user_wallet,
            hourlyswaps.pool_address,
            hourlyswaps.ask_asset,
            hourlyswaps.hour,
            hourlyswaps.cumulative_fee_amount,
            all_hours.c_hour
           FROM (hourlyswaps
             CROSS JOIN ( SELECT DISTINCT hourlyavgprices.hour AS c_hour
                   FROM hourlyavgprices) all_hours)
        ), hourlyswappointscalculation AS (
         SELECT hsw.user_wallet,
            hsw.pool_address,
            hap.hour,
            hsw.ask_asset,
            sum((((hsw.cumulative_fee_amount * hap.hourly_avg_price))::double precision / power((10)::double precision, (t.decimals)::double precision))) AS hourly_swap_points
           FROM ((combinedhourlyswapprices hsw
             JOIN hourlyavgprices hap ON (((hap.hour = hsw.c_hour) AND (hsw.ask_asset = hap.denomination))))
             JOIN v1_cosmos.token t ON ((t.denomination = hsw.ask_asset)))
          GROUP BY hsw.user_wallet, hsw.pool_address, hap.hour, hsw.ask_asset
        ), finalswappointscalculation AS (
         SELECT hsp.user_wallet,
            hsp.pool_address,
            rank() OVER (ORDER BY (sum(hsp.hourly_swap_points)) DESC) AS swap_points_rank,
            sum(hsp.hourly_swap_points) AS total_swap_points
           FROM hourlyswappointscalculation hsp
          GROUP BY hsp.user_wallet, hsp.pool_address
        ), combinedpoints AS (
         SELECT COALESCE(lpc.user_wallet, spc.user_wallet) AS user_wallet,
            COALESCE(lpc.pool_address, spc.pool_address) AS pool_address,
            COALESCE(lpc.total_tower_points, (0)::numeric) AS total_tower_points,
            COALESCE(lpc.total_escher_points, (0)::numeric) AS total_escher_points,
            COALESCE(lpc.total_union_points, (0)::numeric) AS total_union_points,
            COALESCE(lpc.total_satlayer_points, (0)::numeric) AS total_satlayer_points,
            COALESCE(spc.total_swap_points, (0)::double precision) AS total_swap_points,
            spc.swap_points_rank,
            lpc.liquidity_points_rank
           FROM (finalliqduititypointscalculation lpc
             FULL JOIN finalswappointscalculation spc ON (((lpc.user_wallet = spc.user_wallet) AND (lpc.pool_address = spc.pool_address))))
        ), totalpoints AS (
         SELECT combinedpoints.user_wallet AS address,
            sum(combinedpoints.total_tower_points) AS lping_points,
            sum(combinedpoints.total_swap_points) AS swapping_points,
            ((sum(combinedpoints.total_tower_points))::double precision + sum(combinedpoints.total_swap_points)) AS total_points,
            rank() OVER (ORDER BY ((sum(combinedpoints.total_tower_points))::double precision + sum(combinedpoints.total_swap_points)) DESC) AS rank
           FROM combinedpoints
          GROUP BY combinedpoints.user_wallet
          ORDER BY (rank() OVER (ORDER BY ((sum(combinedpoints.total_tower_points))::double precision + sum(combinedpoints.total_swap_points)) DESC))
        )
 SELECT totalpoints.address,
    totalpoints.lping_points,
    totalpoints.swapping_points,
    totalpoints.total_points,
    totalpoints.rank
   FROM totalpoints
  WITH NO DATA;


--
-- Name: materialized_stake_liquidity; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_stake_liquidity AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    (public.attributes(events.*) ->> 'user'::text) AS owner,
    ((public.attributes(events.*) ->> 'amount'::text))::numeric AS amount,
    (public.attributes(events.*) ->> 'lp_token'::text) AS lp_token,
    plt.pool,
    (public.attributes(events.*) ->> '_contract_address'::text) AS incentive_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    events.data
   FROM (v1_cosmos.events
     LEFT JOIN v1_cosmos.pool_lp_token plt ON (((public.attributes(events.*) ->> 'lp_token'::text) = plt.lp_token)))
  WHERE ((events.data ->> 'type'::text) = 'wasm-deposit'::text)
  WITH NO DATA;


--
-- Name: materialized_unstake_liquidity; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_unstake_liquidity AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    (public.attributes(events.*) ->> 'sender'::text) AS owner,
    ((public.attributes(events.*) ->> 'amount'::text))::numeric AS amount,
    (public.attributes(events.*) ->> 'lp_token'::text) AS lp_token,
    plt.pool,
    (public.attributes(events.*) ->> '_contract_address'::text) AS incentive_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    events.data
   FROM (v1_cosmos.events
     LEFT JOIN v1_cosmos.pool_lp_token plt ON (((public.attributes(events.*) ->> 'lp_token'::text) = plt.lp_token)))
  WHERE ((events.data ->> 'type'::text) = 'wasm-withdraw'::text)
  WITH NO DATA;


--
-- Name: materialized_pool_user_shares; Type: MATERIALIZED VIEW; Schema: v1_cosmos; Owner: -
--

CREATE MATERIALIZED VIEW v1_cosmos.materialized_pool_user_shares AS
 WITH combined_liquidity_operations AS (
         SELECT COALESCE(materialized_add_liquidity.receiver, materialized_add_liquidity.sender) AS owner,
            materialized_add_liquidity.pool_address,
            materialized_add_liquidity.share AS share_amount,
            materialized_add_liquidity."timestamp"
           FROM v1_cosmos.materialized_add_liquidity
        UNION ALL
         SELECT materialized_withdraw_liquidity.receiver AS owner,
            materialized_withdraw_liquidity.pool_address,
            (- materialized_withdraw_liquidity.share) AS share_amount,
            materialized_withdraw_liquidity."timestamp"
           FROM v1_cosmos.materialized_withdraw_liquidity
        ), user_total_shares AS (
         SELECT combined_liquidity_operations.pool_address,
            combined_liquidity_operations.owner,
            sum(combined_liquidity_operations.share_amount) AS total_share_amount,
            max(combined_liquidity_operations."timestamp") AS last_update_time
           FROM combined_liquidity_operations
          GROUP BY combined_liquidity_operations.pool_address, combined_liquidity_operations.owner
         HAVING (sum(combined_liquidity_operations.share_amount) > (0)::numeric)
        ), user_staked_shares AS (
         SELECT materialized_stake_liquidity.pool,
            materialized_stake_liquidity.owner,
            sum(materialized_stake_liquidity.amount) AS staked_share_amount,
            materialized_stake_liquidity.incentive_address
           FROM v1_cosmos.materialized_stake_liquidity
          GROUP BY materialized_stake_liquidity.pool, materialized_stake_liquidity.owner, materialized_stake_liquidity.incentive_address
        ), user_unstaked_shares AS (
         SELECT materialized_unstake_liquidity.pool,
            materialized_unstake_liquidity.owner,
            sum(materialized_unstake_liquidity.amount) AS unstaked_share_amount
           FROM v1_cosmos.materialized_unstake_liquidity
          GROUP BY materialized_unstake_liquidity.pool, materialized_unstake_liquidity.owner
        ), final_user_shares AS (
         SELECT t.pool_address,
            t.owner,
            s.incentive_address,
            t.total_share_amount,
            (COALESCE(s.staked_share_amount, (0)::numeric) - COALESCE(u.unstaked_share_amount, (0)::numeric)) AS staked_share_amount,
            (t.total_share_amount - (COALESCE(s.staked_share_amount, (0)::numeric) - COALESCE(u.unstaked_share_amount, (0)::numeric))) AS unstaked_share_amount,
            t.last_update_time
           FROM ((user_total_shares t
             LEFT JOIN user_staked_shares s ON (((t.pool_address = s.pool) AND (t.owner = s.owner))))
             LEFT JOIN user_unstaked_shares u ON (((t.pool_address = u.pool) AND (t.owner = u.owner))))
        )
 SELECT final_user_shares.pool_address,
    final_user_shares.owner,
    final_user_shares.incentive_address,
    final_user_shares.total_share_amount,
    final_user_shares.staked_share_amount,
    final_user_shares.unstaked_share_amount,
    final_user_shares.last_update_time
   FROM final_user_shares
  ORDER BY final_user_shares.pool_address, final_user_shares.owner
  WITH NO DATA;


--
-- Name: pool_incentive_multipliers_id_seq; Type: SEQUENCE; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.pool_incentive_multipliers ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME v1_cosmos.pool_incentive_multipliers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pool_lp_token_id_seq; Type: SEQUENCE; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.pool_lp_token ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME v1_cosmos.pool_lp_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pool_lp_tokens_id_seq; Type: SEQUENCE; Schema: v1_cosmos; Owner: -
--

CREATE SEQUENCE v1_cosmos.pool_lp_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pool_lp_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: v1_cosmos; Owner: -
--

ALTER SEQUENCE v1_cosmos.pool_lp_tokens_id_seq OWNED BY v1_cosmos.pool_lp_token.id;


--
-- Name: stake_liquidity; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.stake_liquidity AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    (public.attributes(events.*) ->> 'user'::text) AS owner,
    ((public.attributes(events.*) ->> 'amount'::text))::numeric AS amount,
    (public.attributes(events.*) ->> 'lp_token'::text) AS lp_token,
    plt.pool,
    (public.attributes(events.*) ->> '_contract_address'::text) AS incentive_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    events.data
   FROM (v1_cosmos.events
     LEFT JOIN v1_cosmos.pool_lp_token plt ON (((public.attributes(events.*) ->> 'lp_token'::text) = plt.lp_token)))
  WHERE ((events.data ->> 'type'::text) = 'wasm-deposit'::text);


--
-- Name: unstake_liquidity; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.unstake_liquidity AS
 SELECT (public.attributes(events.*) ->> 'sender'::text) AS sender,
    (public.attributes(events.*) ->> 'sender'::text) AS owner,
    ((public.attributes(events.*) ->> 'amount'::text))::numeric AS amount,
    (public.attributes(events.*) ->> 'lp_token'::text) AS lp_token,
    plt.pool,
    (public.attributes(events.*) ->> '_contract_address'::text) AS incentive_address,
    ((public.attributes(events.*) ->> 'msg_index'::text))::integer AS msg_index,
    events.chain_id AS internal_chain_id,
    events.block_hash,
    events.height,
    events.index,
    events."time" AS "timestamp",
    events.transaction_hash,
    events.transaction_index,
    events.data
   FROM (v1_cosmos.events
     LEFT JOIN v1_cosmos.pool_lp_token plt ON (((public.attributes(events.*) ->> 'lp_token'::text) = plt.lp_token)))
  WHERE ((events.data ->> 'type'::text) = 'wasm-withdraw'::text);


--
-- Name: pool_user_shares; Type: VIEW; Schema: v1_cosmos; Owner: -
--

CREATE VIEW v1_cosmos.pool_user_shares AS
 WITH combined_liquidity_operations AS (
         SELECT COALESCE(add_liquidity.receiver, add_liquidity.sender) AS owner,
            add_liquidity.pool_address,
            add_liquidity.share AS share_amount,
            add_liquidity."timestamp"
           FROM v1_cosmos.add_liquidity
        UNION ALL
         SELECT withdraw_liquidity.receiver AS owner,
            withdraw_liquidity.pool_address,
            (- withdraw_liquidity.share) AS share_amount,
            withdraw_liquidity."timestamp"
           FROM v1_cosmos.withdraw_liquidity
        ), user_total_shares AS (
         SELECT combined_liquidity_operations.pool_address,
            combined_liquidity_operations.owner,
            sum(combined_liquidity_operations.share_amount) AS total_share_amount,
            max(combined_liquidity_operations."timestamp") AS last_update_time
           FROM combined_liquidity_operations
          GROUP BY combined_liquidity_operations.pool_address, combined_liquidity_operations.owner
         HAVING (sum(combined_liquidity_operations.share_amount) > (0)::numeric)
        ), user_staked_shares AS (
         SELECT stake_liquidity.pool,
            stake_liquidity.owner,
            sum(stake_liquidity.amount) AS staked_share_amount,
            stake_liquidity.incentive_address
           FROM v1_cosmos.stake_liquidity
          GROUP BY stake_liquidity.pool, stake_liquidity.owner, stake_liquidity.incentive_address
        ), user_unstaked_shares AS (
         SELECT unstake_liquidity.pool,
            unstake_liquidity.owner,
            sum(unstake_liquidity.amount) AS unstaked_share_amount
           FROM v1_cosmos.unstake_liquidity
          GROUP BY unstake_liquidity.pool, unstake_liquidity.owner
        ), final_user_shares AS (
         SELECT t.pool_address,
            t.owner,
            s.incentive_address,
            t.total_share_amount,
            (COALESCE(s.staked_share_amount, (0)::numeric) - COALESCE(u.unstaked_share_amount, (0)::numeric)) AS staked_share_amount,
            (t.total_share_amount - (COALESCE(s.staked_share_amount, (0)::numeric) - COALESCE(u.unstaked_share_amount, (0)::numeric))) AS unstaked_share_amount,
            t.last_update_time
           FROM ((user_total_shares t
             LEFT JOIN user_staked_shares s ON (((t.pool_address = s.pool) AND (t.owner = s.owner))))
             LEFT JOIN user_unstaked_shares u ON (((t.pool_address = u.pool) AND (t.owner = u.owner))))
        )
 SELECT final_user_shares.pool_address,
    final_user_shares.owner,
    final_user_shares.incentive_address,
    final_user_shares.total_share_amount,
    final_user_shares.staked_share_amount,
    final_user_shares.unstaked_share_amount,
    final_user_shares.last_update_time
   FROM final_user_shares
  ORDER BY final_user_shares.pool_address, final_user_shares.owner;


--
-- Name: referrals; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.referrals (
    id bigint NOT NULL,
    referred_user_wallet_address text NOT NULL,
    referred_by_user_wallet_address text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: referrals_id_seq; Type: SEQUENCE; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.referrals ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME v1_cosmos.referrals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: token_id_seq; Type: SEQUENCE; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.token ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME v1_cosmos.token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: token_prices_id_seq; Type: SEQUENCE; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.token_prices ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME v1_cosmos.token_prices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: transactions; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.transactions (
    chain_id integer NOT NULL,
    block_hash text NOT NULL,
    height bigint NOT NULL,
    data jsonb NOT NULL,
    hash text NOT NULL,
    index integer NOT NULL
);


--
-- Name: TABLE transactions; Type: COMMENT; Schema: v1_cosmos; Owner: -
--

COMMENT ON TABLE v1_cosmos.transactions IS 'DEPRECATED: use V1';


--
-- Name: user_referral_codes; Type: TABLE; Schema: v1_cosmos; Owner: -
--

CREATE TABLE v1_cosmos.user_referral_codes (
    id bigint NOT NULL,
    user_wallet_address text NOT NULL,
    referral_code character varying(8) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_referral_codes_id_seq; Type: SEQUENCE; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.user_referral_codes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME v1_cosmos.user_referral_codes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: decrypted_secrets; Type: VIEW; Schema: vault; Owner: -
--

CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: chains id; Type: DEFAULT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.chains ALTER COLUMN id SET DEFAULT nextval('hubble.chains_id_seq'::regclass);


--
-- Name: token_sources id; Type: DEFAULT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.token_sources ALTER COLUMN id SET DEFAULT nextval('hubble.token_sources_id_seq'::regclass);


--
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (chain_id, denom);


--
-- Name: block_fix block_fix_pkey; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.block_fix
    ADD CONSTRAINT block_fix_pkey PRIMARY KEY (start_height, end_height);


--
-- Name: block_status block_status_pkey; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.block_status
    ADD CONSTRAINT block_status_pkey PRIMARY KEY (indexer_id, height);


--
-- Name: indexer_status chain_status_pkey; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.indexer_status
    ADD CONSTRAINT chain_status_pkey PRIMARY KEY (indexer_id);


--
-- Name: chains chains_display_name_key; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.chains
    ADD CONSTRAINT chains_display_name_key UNIQUE (display_name);


--
-- Name: chains chains_pkey; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.chains
    ADD CONSTRAINT chains_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (chain_id, client_id, counterparty_chain_id);


--
-- Name: consensus_heights consensus_heights_pkey; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.consensus_heights
    ADD CONSTRAINT consensus_heights_pkey PRIMARY KEY (chain_id, consensus_height);


--
-- Name: contract_status contract_status_pkey; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.contract_status
    ADD CONSTRAINT contract_status_pkey PRIMARY KEY (internal_chain_id, address);


--
-- Name: token_source_representations token_source_representations_pk; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.token_source_representations
    ADD CONSTRAINT token_source_representations_pk PRIMARY KEY (token_source_id, internal_chain_id, address);


--
-- Name: token_sources token_sources_pkey; Type: CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.token_sources
    ADD CONSTRAINT token_sources_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: blocks blocks_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY (chain_id, hash);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (address, internal_chain_id, start_height);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (chain_id, block_hash, index);


--
-- Name: pool_incentive_multipliers pool_incentive_multipliers_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.pool_incentive_multipliers
    ADD CONSTRAINT pool_incentive_multipliers_pkey PRIMARY KEY (id);


--
-- Name: pool_lp_token pool_lp_token_lp_token_key; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.pool_lp_token
    ADD CONSTRAINT pool_lp_token_lp_token_key UNIQUE (lp_token);


--
-- Name: pool_lp_token pool_lp_token_pool_key; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.pool_lp_token
    ADD CONSTRAINT pool_lp_token_pool_key UNIQUE (pool);


--
-- Name: pool_lp_token pool_lp_tokens_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.pool_lp_token
    ADD CONSTRAINT pool_lp_tokens_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_referred_user_wallet_address_key; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.referrals
    ADD CONSTRAINT referrals_referred_user_wallet_address_key UNIQUE (referred_user_wallet_address);


--
-- Name: token token_denomination_key; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.token
    ADD CONSTRAINT token_denomination_key UNIQUE (denomination);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: token_prices_by_block token_prices_by_block_height_next_height_denomination_key; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.token_prices_by_block
    ADD CONSTRAINT token_prices_by_block_height_next_height_denomination_key UNIQUE (height, next_height, denomination);


--
-- Name: token_prices token_prices_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.token_prices
    ADD CONSTRAINT token_prices_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (chain_id, hash);


--
-- Name: user_referral_codes user_referral_codes_pkey; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.user_referral_codes
    ADD CONSTRAINT user_referral_codes_pkey PRIMARY KEY (id);


--
-- Name: user_referral_codes user_referral_codes_referral_code_key; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.user_referral_codes
    ADD CONSTRAINT user_referral_codes_referral_code_key UNIQUE (referral_code);


--
-- Name: user_referral_codes user_referral_codes_user_wallet_address_key; Type: CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.user_referral_codes
    ADD CONSTRAINT user_referral_codes_user_wallet_address_key UNIQUE (user_wallet_address);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: block_status_height_idx; Type: INDEX; Schema: hubble; Owner: -
--

CREATE INDEX block_status_height_idx ON hubble.block_status USING btree (height);


--
-- Name: chains_chain_id_idx; Type: INDEX; Schema: hubble; Owner: -
--

CREATE INDEX chains_chain_id_idx ON hubble.chains USING btree (chain_id) INCLUDE (id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: -
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: -
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- Name: blocks_height_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX blocks_height_idx ON v1_cosmos.blocks USING btree (height);


--
-- Name: events_height_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX events_height_idx ON v1_cosmos.events USING btree (height);


--
-- Name: events_recv_packet_by_chain_destination_channel_sequence_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX events_recv_packet_by_chain_destination_channel_sequence_idx ON v1_cosmos.events USING btree (chain_id, ((public.attributes(events.*) ->> 'packet_dst_channel'::text)), (((public.attributes(events.*) ->> 'packet_sequence'::text))::numeric)) WHERE ((data ->> 'type'::text) = 'recv_packet'::text);


--
-- Name: events_send_packet_by_chain_id_tx_hash_msg_index_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX events_send_packet_by_chain_id_tx_hash_msg_index_idx ON v1_cosmos.events USING btree (chain_id, transaction_hash, (((public.attributes(events.*) ->> 'msg_index'::text))::integer)) WHERE ((data ->> 'type'::text) = 'send_packet'::text);


--
-- Name: events_send_packet_by_time_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX events_send_packet_by_time_idx ON v1_cosmos.events USING btree ("time" DESC) WHERE ((data ->> 'type'::text) = 'send_packet'::text);


--
-- Name: events_send_packet_by_tx_hash_msg_index_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX events_send_packet_by_tx_hash_msg_index_idx ON v1_cosmos.events USING btree (transaction_hash, (((public.attributes(events.*) ->> 'msg_index'::text))::integer)) WHERE ((data ->> 'type'::text) = 'send_packet'::text);


--
-- Name: events_transaction_hash_int4_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX events_transaction_hash_int4_idx ON v1_cosmos.events USING btree (transaction_hash, (((public.attributes(events.*) ->> 'msg_index'::text))::integer));


--
-- Name: events_update_client_by_chain_id_revision_height_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX events_update_client_by_chain_id_revision_height_idx ON v1_cosmos.events USING btree (chain_id, ((split_part((public.attributes(events.*) ->> 'consensus_heights'::text), '-'::text, 2))::numeric)) WHERE ((data ->> 'type'::text) = 'update_client'::text);


--
-- Name: events_wasm_ibc_transfer_by_time_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX events_wasm_ibc_transfer_by_time_idx ON v1_cosmos.events USING btree ("time" DESC) WHERE (((data ->> 'type'::text) = 'wasm-ibc_transfer'::text) AND ((public.attributes(events.*) ->> 'assets'::text) IS NOT NULL));


--
-- Name: idx_blocks_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_blocks_height ON v1_cosmos.blocks USING btree (chain_id, height);


--
-- Name: idx_blocks_time; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_blocks_time ON v1_cosmos.blocks USING btree ("time");


--
-- Name: idx_events_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_events_height ON v1_cosmos.events USING btree (chain_id, height);


--
-- Name: idx_events_height_desc; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_events_height_desc ON v1_cosmos.events USING btree (chain_id, height DESC);


--
-- Name: idx_events_type; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_events_type ON v1_cosmos.events USING btree (((data ->> 'type'::text)));


--
-- Name: idx_malt_pool_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_malt_pool_height ON v1_cosmos.materialized_add_liquidity_totals USING btree (pool_address, height);


--
-- Name: idx_materialized_add_liquidity_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_add_liquidity_height ON v1_cosmos.materialized_add_liquidity USING btree (height);


--
-- Name: idx_materialized_add_liquidity_pool_address; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_add_liquidity_pool_address ON v1_cosmos.materialized_add_liquidity USING btree (pool_address);


--
-- Name: idx_materialized_add_liquidity_pool_address_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_add_liquidity_pool_address_height ON v1_cosmos.materialized_add_liquidity USING btree (pool_address, height);


--
-- Name: idx_materialized_add_liquidity_pool_height_token0; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_add_liquidity_pool_height_token0 ON v1_cosmos.materialized_add_liquidity USING btree (pool_address, height, token0_denom);


--
-- Name: idx_materialized_add_liquidity_pool_height_token1; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_add_liquidity_pool_height_token1 ON v1_cosmos.materialized_add_liquidity USING btree (pool_address, height, token1_denom);


--
-- Name: idx_materialized_add_liquidity_pool_owner; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_add_liquidity_pool_owner ON v1_cosmos.materialized_add_liquidity USING btree (pool_address, COALESCE(receiver, sender));


--
-- Name: idx_materialized_add_liquidity_timestamp; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_add_liquidity_timestamp ON v1_cosmos.materialized_add_liquidity USING btree ("timestamp");


--
-- Name: idx_materialized_add_liquidity_transaction_hash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_add_liquidity_transaction_hash ON v1_cosmos.materialized_add_liquidity USING btree (transaction_hash);


--
-- Name: idx_materialized_add_liquidity_type; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_add_liquidity_type ON v1_cosmos.materialized_add_liquidity USING btree (((data ->> 'type'::text)));


--
-- Name: idx_materialized_incentivize_block_incentives_ts; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_incentivize_block_incentives_ts ON v1_cosmos.materialized_incentivize USING btree (start_ts, end_ts);


--
-- Name: idx_materialized_incentivize_end_ts; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_incentivize_end_ts ON v1_cosmos.materialized_incentivize USING btree (end_ts);


--
-- Name: idx_materialized_incentivize_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_incentivize_height ON v1_cosmos.materialized_incentivize USING btree (height);


--
-- Name: idx_materialized_incentivize_lp_token; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_incentivize_lp_token ON v1_cosmos.materialized_incentivize USING btree (lp_token);


--
-- Name: idx_materialized_incentivize_reward; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_incentivize_reward ON v1_cosmos.materialized_incentivize USING btree (reward);


--
-- Name: idx_materialized_incentivize_start_end_ts; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_incentivize_start_end_ts ON v1_cosmos.materialized_incentivize USING btree (start_ts, end_ts);


--
-- Name: idx_materialized_incentivize_start_ts; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_incentivize_start_ts ON v1_cosmos.materialized_incentivize USING btree (start_ts);


--
-- Name: idx_materialized_incentivize_transaction_hash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_incentivize_transaction_hash ON v1_cosmos.materialized_incentivize USING btree (transaction_hash);


--
-- Name: idx_materialized_incentivize_type; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_incentivize_type ON v1_cosmos.materialized_incentivize USING btree (((data ->> 'type'::text)));


--
-- Name: idx_materialized_pools_create_pair_transaction_hash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_pools_create_pair_transaction_hash ON v1_cosmos.materialized_pools USING btree (transaction_hash);


--
-- Name: idx_materialized_pools_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_pools_height ON v1_cosmos.materialized_pools USING btree (height);


--
-- Name: idx_materialized_pools_register_transaction_hash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_pools_register_transaction_hash ON v1_cosmos.materialized_pools USING btree (transaction_hash);


--
-- Name: idx_materialized_pools_timestamp; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_pools_timestamp ON v1_cosmos.materialized_pools USING btree ("timestamp");


--
-- Name: idx_materialized_pools_token0; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_pools_token0 ON v1_cosmos.materialized_pools USING btree (token0);


--
-- Name: idx_materialized_pools_token1; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_pools_token1 ON v1_cosmos.materialized_pools USING btree (token1);


--
-- Name: idx_materialized_pools_transaction_hash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_pools_transaction_hash ON v1_cosmos.materialized_pools USING btree (transaction_hash);


--
-- Name: idx_materialized_stake_liquidity_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_stake_liquidity_height ON v1_cosmos.materialized_stake_liquidity USING btree (height);


--
-- Name: idx_materialized_stake_liquidity_lp_token; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_stake_liquidity_lp_token ON v1_cosmos.materialized_stake_liquidity USING btree (lp_token);


--
-- Name: idx_materialized_stake_liquidity_owner; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_stake_liquidity_owner ON v1_cosmos.materialized_stake_liquidity USING btree (owner);


--
-- Name: idx_materialized_stake_liquidity_pool_owner; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_stake_liquidity_pool_owner ON v1_cosmos.materialized_stake_liquidity USING btree (pool, owner);


--
-- Name: idx_materialized_stake_liquidity_sender; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_stake_liquidity_sender ON v1_cosmos.materialized_stake_liquidity USING btree (sender);


--
-- Name: idx_materialized_stake_liquidity_transaction_hash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_stake_liquidity_transaction_hash ON v1_cosmos.materialized_stake_liquidity USING btree (transaction_hash);


--
-- Name: idx_materialized_stake_liquidity_type; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_stake_liquidity_type ON v1_cosmos.materialized_stake_liquidity USING btree (((data ->> 'type'::text)));


--
-- Name: idx_materialized_swap_ask_asset; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_ask_asset ON v1_cosmos.materialized_swap USING btree (ask_asset);


--
-- Name: idx_materialized_swap_block_fees_height_offer_asset; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_block_fees_height_offer_asset ON v1_cosmos.materialized_swap USING btree (height, offer_asset);


--
-- Name: idx_materialized_swap_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_height ON v1_cosmos.materialized_swap USING btree (height);


--
-- Name: idx_materialized_swap_offer_asset; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_offer_asset ON v1_cosmos.materialized_swap USING btree (offer_asset);


--
-- Name: idx_materialized_swap_pool_address; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_pool_address ON v1_cosmos.materialized_swap USING btree (pool_address);


--
-- Name: idx_materialized_swap_pool_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_pool_height ON v1_cosmos.materialized_swap USING btree (pool_address, height);


--
-- Name: idx_materialized_swap_pool_offer_ask; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_pool_offer_ask ON v1_cosmos.materialized_swap USING btree (pool_address, offer_asset, ask_asset);


--
-- Name: idx_materialized_swap_receiver; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_receiver ON v1_cosmos.materialized_swap USING btree (receiver);


--
-- Name: idx_materialized_swap_sender; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_sender ON v1_cosmos.materialized_swap USING btree (sender);


--
-- Name: idx_materialized_swap_transaction_hash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_transaction_hash ON v1_cosmos.materialized_swap USING btree (transaction_hash);


--
-- Name: idx_materialized_swap_type; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_swap_type ON v1_cosmos.materialized_swap USING btree (((data ->> 'type'::text)));


--
-- Name: idx_materialized_unstake_liquidity_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_unstake_liquidity_height ON v1_cosmos.materialized_unstake_liquidity USING btree (height);


--
-- Name: idx_materialized_unstake_liquidity_lp_token; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_unstake_liquidity_lp_token ON v1_cosmos.materialized_unstake_liquidity USING btree (lp_token);


--
-- Name: idx_materialized_unstake_liquidity_pool_owner; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_unstake_liquidity_pool_owner ON v1_cosmos.materialized_unstake_liquidity USING btree (pool, owner);


--
-- Name: idx_materialized_unstake_liquidity_sender; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_unstake_liquidity_sender ON v1_cosmos.materialized_unstake_liquidity USING btree (sender);


--
-- Name: idx_materialized_unstake_liquidity_transaction_hash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_unstake_liquidity_transaction_hash ON v1_cosmos.materialized_unstake_liquidity USING btree (transaction_hash);


--
-- Name: idx_materialized_unstake_liquidity_type; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_unstake_liquidity_type ON v1_cosmos.materialized_unstake_liquidity USING btree (((data ->> 'type'::text)));


--
-- Name: idx_materialized_withdraw_liquidity_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_height ON v1_cosmos.materialized_withdraw_liquidity USING btree (height);


--
-- Name: idx_materialized_withdraw_liquidity_pool_address; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_pool_address ON v1_cosmos.materialized_withdraw_liquidity USING btree (pool_address);


--
-- Name: idx_materialized_withdraw_liquidity_pool_height_token0; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_pool_height_token0 ON v1_cosmos.materialized_withdraw_liquidity USING btree (pool_address, height, token0_denom);


--
-- Name: idx_materialized_withdraw_liquidity_pool_height_token1; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_pool_height_token1 ON v1_cosmos.materialized_withdraw_liquidity USING btree (pool_address, height, token1_denom);


--
-- Name: idx_materialized_withdraw_liquidity_pool_owner; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_pool_owner ON v1_cosmos.materialized_withdraw_liquidity USING btree (pool_address, sender);


--
-- Name: idx_materialized_withdraw_liquidity_pool_token0_token1; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_pool_token0_token1 ON v1_cosmos.materialized_withdraw_liquidity USING btree (pool_address, token0_denom, token1_denom);


--
-- Name: idx_materialized_withdraw_liquidity_receiver; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_receiver ON v1_cosmos.materialized_withdraw_liquidity USING btree (receiver);


--
-- Name: idx_materialized_withdraw_liquidity_sender; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_sender ON v1_cosmos.materialized_withdraw_liquidity USING btree (sender);


--
-- Name: idx_materialized_withdraw_liquidity_token0_denom; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_token0_denom ON v1_cosmos.materialized_withdraw_liquidity USING btree (token0_denom);


--
-- Name: idx_materialized_withdraw_liquidity_token1_denom; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_token1_denom ON v1_cosmos.materialized_withdraw_liquidity USING btree (token1_denom);


--
-- Name: idx_materialized_withdraw_liquidity_transaction_hash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_transaction_hash ON v1_cosmos.materialized_withdraw_liquidity USING btree (transaction_hash);


--
-- Name: idx_materialized_withdraw_liquidity_type; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_materialized_withdraw_liquidity_type ON v1_cosmos.materialized_withdraw_liquidity USING btree (((data ->> 'type'::text)));


--
-- Name: idx_mst_pool_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_mst_pool_height ON v1_cosmos.materialized_swap_totals USING btree (pool_address, height);


--
-- Name: idx_mwlt_pool_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_mwlt_pool_height ON v1_cosmos.materialized_withdraw_liquidity_totals USING btree (pool_address, height);


--
-- Name: idx_pool_incentive_multipliers_pool_address_origin; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_pool_incentive_multipliers_pool_address_origin ON v1_cosmos.pool_incentive_multipliers USING btree (pool_address, origin);


--
-- Name: idx_pool_lp_token_lp_token; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_pool_lp_token_lp_token ON v1_cosmos.pool_lp_token USING btree (lp_token);


--
-- Name: idx_token_prices_token; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_token_prices_token ON v1_cosmos.token_prices USING btree (token);


--
-- Name: idx_unique_add_liquidity_height_idx_txhash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_add_liquidity_height_idx_txhash ON v1_cosmos.materialized_add_liquidity USING btree (height, index, transaction_hash);


--
-- Name: idx_unique_mah_pool_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_mah_pool_height ON v1_cosmos.materialized_all_heights USING btree (pool_address, height);


--
-- Name: idx_unique_materialized_incentivize_height_idx_txhash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_materialized_incentivize_height_idx_txhash ON v1_cosmos.materialized_incentivize USING btree (height, index, transaction_hash);


--
-- Name: idx_unique_materialized_pool_balance_height_pool_address; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_materialized_pool_balance_height_pool_address ON v1_cosmos.materialized_pool_balance USING btree (height, pool_address);


--
-- Name: idx_unique_materialized_pools_pool_address; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_materialized_pools_pool_address ON v1_cosmos.materialized_pools USING btree (pool_address);


--
-- Name: idx_unique_mbd_height_next_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_mbd_height_next_height ON v1_cosmos.materialized_block_data USING btree (height, next_height);


--
-- Name: idx_unique_mbf_height_pool_address_ask_asset; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_mbf_height_pool_address_ask_asset ON v1_cosmos.materialized_block_fees USING btree (height, pool_address, fee_token_denom);


--
-- Name: idx_unique_mbi_height_lp_token_reward; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_mbi_height_lp_token_reward ON v1_cosmos.materialized_block_incentives USING btree (height, lp_token, incentive_token_denom);


--
-- Name: idx_unique_mhpy_height_pool_address_t0_denom_t1_denom; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_mhpy_height_pool_address_t0_denom_t1_denom ON v1_cosmos.materialized_historic_pool_yield USING btree (height, pool_address, token0_denom, token1_denom);


--
-- Name: idx_unique_mpft_height_pool_address; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_mpft_height_pool_address ON v1_cosmos.materialized_pool_fee_totals USING btree (height, pool_address);


--
-- Name: idx_unique_mpit_height_pool_address; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_mpit_height_pool_address ON v1_cosmos.materialized_pool_incentive_totals USING btree (height, pool_address);


--
-- Name: idx_unique_mpl_height_pool_address_t0_denom_t1_denom; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_mpl_height_pool_address_t0_denom_t1_denom ON v1_cosmos.materialized_pool_liquidity USING btree (height, pool_address, token0_denom, token1_denom);


--
-- Name: idx_unique_points_user_wallet; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_points_user_wallet ON v1_cosmos.materialized_points USING btree (address);


--
-- Name: idx_unique_stake_liquidity_height_idx_txhash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_stake_liquidity_height_idx_txhash ON v1_cosmos.materialized_stake_liquidity USING btree (height, index, transaction_hash);


--
-- Name: idx_unique_swap_height_idx_txhash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_swap_height_idx_txhash ON v1_cosmos.materialized_swap USING btree (height, index, transaction_hash);


--
-- Name: idx_unique_token_denomination; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_token_denomination ON v1_cosmos.token USING btree (denomination);


--
-- Name: idx_unique_token_prices_ceated_at_token; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_token_prices_ceated_at_token ON v1_cosmos.token_prices USING btree (created_at, token);


--
-- Name: idx_unique_token_token_name; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_token_token_name ON v1_cosmos.token USING btree (token_name);


--
-- Name: idx_unique_token_token_name_denomination; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_token_token_name_denomination ON v1_cosmos.token USING btree (token_name, denomination);


--
-- Name: idx_unique_unstake_liquidity_height_index_txhash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_unstake_liquidity_height_index_txhash ON v1_cosmos.materialized_unstake_liquidity USING btree (height, index, transaction_hash);


--
-- Name: idx_unique_withdraw_liquidity_height_idx_txhash; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE UNIQUE INDEX idx_unique_withdraw_liquidity_height_idx_txhash ON v1_cosmos.materialized_withdraw_liquidity USING btree (height, index, transaction_hash);


--
-- Name: idx_user_total_shares_pool_owner; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX idx_user_total_shares_pool_owner ON v1_cosmos.materialized_pool_user_shares USING btree (pool_address, owner);


--
-- Name: referrals_referred_by_user_wallet_address_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX referrals_referred_by_user_wallet_address_idx ON v1_cosmos.referrals USING btree (referred_by_user_wallet_address);


--
-- Name: referrals_referred_user_wallet_address_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX referrals_referred_user_wallet_address_idx ON v1_cosmos.referrals USING btree (referred_user_wallet_address);


--
-- Name: transactions_chain_id_height; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX transactions_chain_id_height ON v1_cosmos.transactions USING btree (chain_id, height DESC);


--
-- Name: user_referral_codes_referral_code_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX user_referral_codes_referral_code_idx ON v1_cosmos.user_referral_codes USING btree (referral_code);


--
-- Name: user_referral_codes_user_wallet_address_idx; Type: INDEX; Schema: v1_cosmos; Owner: -
--

CREATE INDEX user_referral_codes_user_wallet_address_idx ON v1_cosmos.user_referral_codes USING btree (user_wallet_address);


--
-- Name: block_fix update_timestamp; Type: TRIGGER; Schema: hubble; Owner: -
--

CREATE TRIGGER update_timestamp BEFORE UPDATE ON hubble.block_fix FOR EACH ROW EXECUTE FUNCTION hubble.update_updated_at_column();


--
-- Name: block_status update_timestamp; Type: TRIGGER; Schema: hubble; Owner: -
--

CREATE TRIGGER update_timestamp BEFORE UPDATE ON hubble.block_status FOR EACH ROW EXECUTE FUNCTION hubble.update_updated_at_column();


--
-- Name: contract_status update_timestamp; Type: TRIGGER; Schema: hubble; Owner: -
--

CREATE TRIGGER update_timestamp BEFORE UPDATE ON hubble.contract_status FOR EACH ROW EXECUTE FUNCTION hubble.update_updated_at_column();


--
-- Name: indexer_status update_timestamp; Type: TRIGGER; Schema: hubble; Owner: -
--

CREATE TRIGGER update_timestamp BEFORE UPDATE ON hubble.indexer_status FOR EACH ROW EXECUTE FUNCTION hubble.update_updated_at_column();


--
-- Name: token_source_representations update_timestamp; Type: TRIGGER; Schema: hubble; Owner: -
--

CREATE TRIGGER update_timestamp BEFORE UPDATE ON hubble.token_source_representations FOR EACH ROW EXECUTE FUNCTION hubble.update_updated_at_column();


--
-- Name: token_sources update_timestamp; Type: TRIGGER; Schema: hubble; Owner: -
--

CREATE TRIGGER update_timestamp BEFORE UPDATE ON hubble.token_sources FOR EACH ROW EXECUTE FUNCTION hubble.update_updated_at_column();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: assets assets_chain_id_fkey; Type: FK CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.assets
    ADD CONSTRAINT assets_chain_id_fkey FOREIGN KEY (chain_id) REFERENCES hubble.chains(id) ON UPDATE SET NULL ON DELETE SET NULL;


--
-- Name: clients clients_chain_id_fkey; Type: FK CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.clients
    ADD CONSTRAINT clients_chain_id_fkey FOREIGN KEY (chain_id) REFERENCES hubble.chains(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: consensus_heights consensus_heights_chain_id_fkey; Type: FK CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.consensus_heights
    ADD CONSTRAINT consensus_heights_chain_id_fkey FOREIGN KEY (chain_id) REFERENCES hubble.chains(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contract_status fk_internal_chain_id; Type: FK CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.contract_status
    ADD CONSTRAINT fk_internal_chain_id FOREIGN KEY (internal_chain_id) REFERENCES hubble.chains(id) ON DELETE CASCADE;


--
-- Name: token_source_representations token_source_representations_chains_id_fk; Type: FK CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.token_source_representations
    ADD CONSTRAINT token_source_representations_chains_id_fk FOREIGN KEY (internal_chain_id) REFERENCES hubble.chains(id);


--
-- Name: token_source_representations token_source_representations_token_sources_id_fk; Type: FK CONSTRAINT; Schema: hubble; Owner: -
--

ALTER TABLE ONLY hubble.token_source_representations
    ADD CONSTRAINT token_source_representations_token_sources_id_fk FOREIGN KEY (token_source_id) REFERENCES hubble.token_sources(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: blocks blocks_chain_id_fkey; Type: FK CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.blocks
    ADD CONSTRAINT blocks_chain_id_fkey FOREIGN KEY (chain_id) REFERENCES hubble.chains(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contracts contracts_chain_id_fkey; Type: FK CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.contracts
    ADD CONSTRAINT contracts_chain_id_fkey FOREIGN KEY (internal_chain_id) REFERENCES hubble.chains(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: events events_chain_id_block_hash_fkey; Type: FK CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.events
    ADD CONSTRAINT events_chain_id_block_hash_fkey FOREIGN KEY (chain_id, block_hash) REFERENCES v1_cosmos.blocks(chain_id, hash) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: events events_chain_id_fkey; Type: FK CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.events
    ADD CONSTRAINT events_chain_id_fkey FOREIGN KEY (chain_id) REFERENCES hubble.chains(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: events events_chain_id_transaction_hash_fkey; Type: FK CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.events
    ADD CONSTRAINT events_chain_id_transaction_hash_fkey FOREIGN KEY (chain_id, transaction_hash) REFERENCES v1_cosmos.transactions(chain_id, hash) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: token token_chain_id_fkey; Type: FK CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.token
    ADD CONSTRAINT token_chain_id_fkey FOREIGN KEY (chain_id) REFERENCES hubble.chains(id);


--
-- Name: transactions transactions_block_hash_chain_id_fkey; Type: FK CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.transactions
    ADD CONSTRAINT transactions_block_hash_chain_id_fkey FOREIGN KEY (block_hash, chain_id) REFERENCES v1_cosmos.blocks(hash, chain_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transactions transactions_chain_id_fkey; Type: FK CONSTRAINT; Schema: v1_cosmos; Owner: -
--

ALTER TABLE ONLY v1_cosmos.transactions
    ADD CONSTRAINT transactions_chain_id_fkey FOREIGN KEY (chain_id) REFERENCES hubble.chains(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: assets; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.assets ENABLE ROW LEVEL SECURITY;

--
-- Name: block_fix; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.block_fix ENABLE ROW LEVEL SECURITY;

--
-- Name: block_status; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.block_status ENABLE ROW LEVEL SECURITY;

--
-- Name: chains; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.chains ENABLE ROW LEVEL SECURITY;

--
-- Name: clients; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.clients ENABLE ROW LEVEL SECURITY;

--
-- Name: consensus_heights; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.consensus_heights ENABLE ROW LEVEL SECURITY;

--
-- Name: contract_status; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.contract_status ENABLE ROW LEVEL SECURITY;

--
-- Name: indexer_status; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.indexer_status ENABLE ROW LEVEL SECURITY;

--
-- Name: token_source_representations; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.token_source_representations ENABLE ROW LEVEL SECURITY;

--
-- Name: token_sources; Type: ROW SECURITY; Schema: hubble; Owner: -
--

ALTER TABLE hubble.token_sources ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: blocks; Type: ROW SECURITY; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.blocks ENABLE ROW LEVEL SECURITY;

--
-- Name: contracts; Type: ROW SECURITY; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.contracts ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.events ENABLE ROW LEVEL SECURITY;

--
-- Name: pool_lp_token; Type: ROW SECURITY; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.pool_lp_token ENABLE ROW LEVEL SECURITY;

--
-- Name: token; Type: ROW SECURITY; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.token ENABLE ROW LEVEL SECURITY;

--
-- Name: token_prices; Type: ROW SECURITY; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.token_prices ENABLE ROW LEVEL SECURITY;

--
-- Name: transactions; Type: ROW SECURITY; Schema: v1_cosmos; Owner: -
--

ALTER TABLE v1_cosmos.transactions ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--


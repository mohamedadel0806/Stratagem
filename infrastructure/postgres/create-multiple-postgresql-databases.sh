#!/bin/bash

set -e
set -u

function create_user_and_database() {
	local database=$1
	local password=""
	
	# Set specific passwords for known databases
	case $database in
		keycloak)
			password="keycloak_password"
			;;
		kong)
			password="kong_password"
			;;
		*)
			password="${database}_password"
			;;
	esac
	
	echo "  Creating user and database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    DO \$\$
	    BEGIN
	        IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$database') THEN
	            CREATE USER $database WITH PASSWORD '$password';
	        ELSE
	            ALTER USER $database WITH PASSWORD '$password';
	        END IF;
	    END
	    \$\$;
	    CREATE DATABASE $database;
	    GRANT ALL PRIVILEGES ON DATABASE $database TO $database;
	    
	    -- Grant schema permissions
	    \c $database;
	    GRANT ALL ON SCHEMA public TO $database;
	    ALTER SCHEMA public OWNER TO $database;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		create_user_and_database $db
	done
	echo "Multiple databases created"
fi
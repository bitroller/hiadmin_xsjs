CREATE ROW TABLE "DBR0LLER"."modelfiles"  ( "USER" NVARCHAR(128)  CS_STRING, "MODEL" NVARCHAR(64)  CS_STRING, "FILENAME" NVARCHAR(256)  CS_STRING, "FILE" NCLOB  MEMORY THRESHOLD 1000  , PRIMARY KEY ( "USER", "MODEL", "FILENAME" ) ) 
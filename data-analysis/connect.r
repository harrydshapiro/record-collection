library(DBI)
library(RPostgres)
con <- dbConnect(RPostgres::Postgres(),dbname = "",
                 host = "",
                 port = 5432,
                 user = "",
                 password = "")

dbListTables(con)

res <- dbSendQuery(con, "SELECT * FROM users")
dbFetch(res)
dbClearResult(res)

dbDisconnect(con)
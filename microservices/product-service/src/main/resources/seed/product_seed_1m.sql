-- 1,000,000 random Product records in a single INSERT statement.
-- Target table: products. Hibernate creates it when ddl-auto=update is active.
-- Run manually:
-- psql -h localhost -p 5433 -U postgres -d products -f product_seed_1m.sql
INSERT INTO products (id, name, description, price, stock)
SELECT gen_random_uuid(),
       'Product-' || g,
       'Generated product #' || g,
       round((random() * 9999 + 1)::numeric, 2),
       floor(random() * 1000)::int
FROM generate_series(1, 1000000) AS g;

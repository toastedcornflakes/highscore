-- get the current best
local best_saved = redis.call('get', KEYS[1]);

-- and update it if new is better
if not best_saved or best_saved < ARGV[1] then
    redis.call('set', KEYS[1], ARGV[1])
end

-- same for best worldwide
local best_world = redis.call('get', KEYS[3]);
if not best_world or best_world < ARGV[1] then
    redis.call('set', KEYS[3], ARGV[1])
end

-- set latest
redis.call('set', KEYS[2], ARGV[1])

﻿// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Garnet.common;

namespace Garnet.server
{
    /// <summary>
    /// Container for command information
    /// </summary>
    class RespCommandsInfo
    {
        public readonly string nameStr;

        /// <summary>
        /// Number of arguments of the command.
        /// </summary>
        public readonly int arity;

        /// <summary>
        /// Name of the command
        /// </summary>
        public readonly byte[] name;
        public readonly byte arrayCommand;

        /// <summary>
        /// Associated RESPCommand Id
        /// </summary>
        public readonly RespCommand command;
        public readonly HashSet<RespCommandOption> options;
        public readonly RespCommandFlags flags;
        public readonly int firstKey;
        public readonly int lastKey;
        public readonly int step;
        public readonly RespAclCategories aclCats;
        public readonly RespCommandsInfo[] subcommands;
        public readonly string respFormatCommandInfo;

        private readonly string[] strFlags;
        private readonly string[] strAclCats;

        private static readonly Lazy<IDictionary<string, string>> LazyFlagNameToDesc = new(EnumUtils.GetEnumNameToDescription<RespCommandFlags>);
        private static readonly Lazy<IDictionary<string, string>> LazyAclCatNameToDesc = new(EnumUtils.GetEnumNameToDescription<RespAclCategories>);

        public RespCommandsInfo(string name, RespCommand command, int arity, HashSet<RespCommandOption> options, RespCommandFlags flags = RespCommandFlags.None, int firstKey = 1, int lastKey = 1, int step = 1, RespAclCategories aclCats = RespAclCategories.None, RespCommandsInfo[] subcommands = null)
        {
            nameStr = name.ToUpper();
            this.name = Encoding.ASCII.GetBytes(nameStr);
            this.command = command;
            this.arity = arity;
            this.options = options;
            this.arrayCommand = 255;
            this.flags = flags;
            this.firstKey = firstKey;
            this.lastKey = lastKey;
            this.step = step;
            this.aclCats = aclCats;
            this.subcommands = subcommands ?? Array.Empty<RespCommandsInfo>();

            string[] GetFlagsDesc(Enum fVal, IDictionary<string, string> nameToDesc) => fVal.ToString().Split(',').Select(f => nameToDesc[f.Trim()]).ToArray();
            this.strFlags = flags == RespCommandFlags.None ? Array.Empty<string>() : GetFlagsDesc(flags, LazyFlagNameToDesc.Value);
            this.strAclCats = aclCats == RespAclCategories.None ? Array.Empty<string>() : GetFlagsDesc(aclCats, LazyAclCatNameToDesc.Value);

            this.respFormatCommandInfo = GetRespFormatCommandInfo();
        }

        public RespCommandsInfo(string name, RespCommand command, int arity, HashSet<RespCommandOption> options, byte arrayCommand, RespCommandFlags flags = RespCommandFlags.None, int firstKey = 1, int lastKey = 1, int step = 1, RespAclCategories aclCats = RespAclCategories.None, RespCommandsInfo[] subcommands = null) : this(name, command, arity, options, flags, firstKey, lastKey, step, aclCats, subcommands)
        {
            this.arrayCommand = arrayCommand;
        }

        /// <summary>
        /// Check whether the option is for this command or not and returns RespCommandsOptionInfo
        /// </summary>
        public bool MatchOptions(ReadOnlySpan<byte> command, out RespCommandsOptionInfo optionOutput)
        {
            for (int i = 0; i < RespCommandsOptionInfo.optionMap.Length; i++)
            {
                optionOutput = RespCommandsOptionInfo.optionMap[i];
                if (command.SequenceEqual(new ReadOnlySpan<byte>(optionOutput.name)) && this.options.Contains(optionOutput.option))
                    return true;
            }
            optionOutput = null;
            return false;
        }

        public static RespCommandsInfo FindCommand(RespCommand cmd, byte subCmd = 0)
        {

            RespCommandsInfo result = cmd switch
            {
                RespCommand.SortedSet => sortedSetCommandsInfoMap.GetValueOrDefault(subCmd),
                RespCommand.List => listCommandsInfoMap.GetValueOrDefault(subCmd),
                RespCommand.Hash => hashCommandsInfoMap.GetValueOrDefault(subCmd),
                RespCommand.Set => setCommandsInfoMap.GetValueOrDefault(subCmd),
                RespCommand.All => customCommandsInfoMap.GetValueOrDefault(cmd),
                _ => basicCommandsInfoMap.GetValueOrDefault(cmd)
            };
            return result;
        }

        public static IEnumerable<RespCommandsInfo> GetAllCommandsInfo()
        {
            foreach (var value in basicCommandsInfoMap.Values) yield return value;
            foreach (var value in customCommandsInfoMap.Values) yield return value;
            foreach (var value in hashCommandsInfoMap.Values) yield return value;
            foreach (var value in listCommandsInfoMap.Values) yield return value;
            foreach (var value in setCommandsInfoMap.Values) yield return value;
            foreach (var value in sortedSetCommandsInfoMap.Values) yield return value;
        }

        private static readonly Dictionary<byte, RespCommandsInfo> configCommandsInfoMap = new()
        {
            { (byte)ConfigSubCommands.GET, new RespCommandsInfo("CONFIG|GET", RespCommand.CONFIG, -2, null, (byte)ConfigSubCommands.GET,
                RespCommandFlags.Admin | RespCommandFlags.NoScript | RespCommandFlags.Loading | RespCommandFlags.Stale, 0, 0, 0,
                RespAclCategories.Admin | RespAclCategories.Slow | RespAclCategories.Dangerous) },
            { (byte)ConfigSubCommands.REWRITE, new RespCommandsInfo("CONFIG|REWRITE", RespCommand.CONFIG, 1, null, (byte)ConfigSubCommands.REWRITE,
                RespCommandFlags.Admin | RespCommandFlags.NoScript | RespCommandFlags.Loading | RespCommandFlags.Stale, 0, 0, 0,
                RespAclCategories.Admin | RespAclCategories.Slow | RespAclCategories.Dangerous) },
            { (byte)ConfigSubCommands.SET, new RespCommandsInfo("CONFIG|SET", RespCommand.CONFIG, -3, null, (byte)ConfigSubCommands.SET,
                RespCommandFlags.Admin | RespCommandFlags.NoScript | RespCommandFlags.Loading | RespCommandFlags.Stale, 0, 0, 0,
                RespAclCategories.Admin | RespAclCategories.Slow | RespAclCategories.Dangerous) },
        };

        private static readonly Dictionary<RespCommand, RespCommandsInfo> basicCommandsInfoMap =
            new()
            {
                {
                    RespCommand.GET,    new RespCommandsInfo("GET", RespCommand.GET, 1, null, RespCommandFlags.ReadOnly | RespCommandFlags.Fast, 1, 1, 1, 
                        RespAclCategories.Read | RespAclCategories.String | RespAclCategories.Fast)
                },
                {
                    RespCommand.SET,    new RespCommandsInfo("SET", RespCommand.SET, -2, new HashSet<RespCommandOption>
                    {
                        RespCommandOption.EX,
                        RespCommandOption.NX,
                        RespCommandOption.XX,
                        RespCommandOption.GET,
                        RespCommandOption.PX,
                        RespCommandOption.EXAT,
                        RespCommandOption.PXAT,
                    }, RespCommandFlags.Write | RespCommandFlags.DenyOom, 1, 1, 1, RespAclCategories.Write | RespAclCategories.String | RespAclCategories.Slow)
                },
                {RespCommand.GETRANGE,    new RespCommandsInfo("GETRANGE",   RespCommand.GETRANGE,    3, null)},
                        {RespCommand.SETRANGE,    new RespCommandsInfo("SETRANGE",   RespCommand.SETRANGE,    3, null)},
                // PUBLISH
                {RespCommand.PFADD,       new RespCommandsInfo("PFADD",      RespCommand.PFADD,      -2, null)},
                {RespCommand.PFCOUNT,     new RespCommandsInfo("PFCOUNT",    RespCommand.PFCOUNT,    -1, null)},
                {RespCommand.PFMERGE,     new RespCommandsInfo("PFMERGE",    RespCommand.PFMERGE,    -2, null)},

                {RespCommand.SETEX,       new RespCommandsInfo("SETEX",      RespCommand.SETEX,      -3, null)},
                {RespCommand.PSETEX,      new RespCommandsInfo("PSETEX",     RespCommand.PSETEX,      3, null)},
                {RespCommand.SETEXNX,     new RespCommandsInfo("SETEXNX",    RespCommand.SETEXNX,    -2, null)},
                {RespCommand.SETEXXX,     new RespCommandsInfo("SETEXXX",    RespCommand.SETEXXX,    -2, null)},
                {RespCommand.DEL,         new RespCommandsInfo("DEL",        RespCommand.DEL,        -1, null)},
                {RespCommand.EXISTS,      new RespCommandsInfo("EXISTS",     RespCommand.EXISTS,      1, null)},
                {RespCommand.RENAME,      new RespCommandsInfo("RENAME",     RespCommand.RENAME,      2, null)},
                {RespCommand.INCR,        new RespCommandsInfo("INCR",       RespCommand.INCR,        1, null)},
                {RespCommand.INCRBY,      new RespCommandsInfo("INCRBY",     RespCommand.INCRBY,      2, null)},
                {RespCommand.DECR,        new RespCommandsInfo("DECR",       RespCommand.DECR,        1, null)},
                {RespCommand.DECRBY,      new RespCommandsInfo("DECRBY",     RespCommand.DECRBY,      2, null)},
                {RespCommand.EXPIRE,      new RespCommandsInfo("EXPIRE",     RespCommand.EXPIRE,     -2, new HashSet<RespCommandOption>{
                    RespCommandOption.NX,
                    RespCommandOption.XX,
                    RespCommandOption.GT,
                    RespCommandOption.LT,
                })},
                {RespCommand.PEXPIRE,     new RespCommandsInfo("PEXPIRE",    RespCommand.PEXPIRE,    -2, new HashSet<RespCommandOption>{
                    RespCommandOption.NX,
                    RespCommandOption.XX,
                    RespCommandOption.GT,
                    RespCommandOption.LT,
                })},
                {RespCommand.PERSIST,     new RespCommandsInfo("PERSIST",    RespCommand.PERSIST,     1, null)},
                {RespCommand.TTL,         new RespCommandsInfo("TTL",        RespCommand.TTL,         1, null)},
                {RespCommand.PTTL,        new RespCommandsInfo("PTTL",       RespCommand.PTTL,        1, null)},
                {RespCommand.SETBIT,      new RespCommandsInfo("SETBIT",     RespCommand.SETBIT,      3, null)},
                {RespCommand.GETBIT,      new RespCommandsInfo("GETBIT",     RespCommand.GETBIT,      2, null)},
                {RespCommand.BITCOUNT,    new RespCommandsInfo("BITCOUNT",   RespCommand.BITCOUNT,   -1, null)},
                {RespCommand.BITPOS,      new RespCommandsInfo("BITPOS",     RespCommand.BITPOS,     -2, null)},
                {RespCommand.BITFIELD,    new RespCommandsInfo("BITFIELD",   RespCommand.BITFIELD,   -1, null)},

                {RespCommand.MSET,        new RespCommandsInfo("MSET",       RespCommand.MSET,       -2, null)},
                {RespCommand.MSETNX,      new RespCommandsInfo("MSETNX",     RespCommand.MSETNX,     -2, null)},
                {RespCommand.MGET,        new RespCommandsInfo("MGET",       RespCommand.MGET,       -2, null)},
                {RespCommand.UNLINK,      new RespCommandsInfo("UNLINK",     RespCommand.UNLINK,     -1, null)},

                {RespCommand.MULTI,       new RespCommandsInfo("MULTI",      RespCommand.MULTI,       0,  null)},
                {RespCommand.EXEC,        new RespCommandsInfo("EXEC",       RespCommand.EXEC,        0,  null)},
                {RespCommand.WATCH,       new RespCommandsInfo("WATCH",      RespCommand.WATCH,      -1, null)},
                {RespCommand.UNWATCH,     new RespCommandsInfo("WATCH",      RespCommand.UNWATCH,     0, null)},
                {RespCommand.DISCARD,     new RespCommandsInfo("DISCARD",    RespCommand.DISCARD,     0,  null)},
                {RespCommand.GETDEL,      new RespCommandsInfo("GETDEL",     RespCommand.GETDEL,      1, null)},
                {RespCommand.APPEND,      new RespCommandsInfo("APPEND",     RespCommand.APPEND,      2,  null)},

                //Admin Commands
                {RespCommand.ECHO,        new RespCommandsInfo("ECHO",       RespCommand.ECHO,        1, null)},
                {RespCommand.REPLICAOF,   new RespCommandsInfo("REPLICAOF",  RespCommand.REPLICAOF,   2, null)},
                {RespCommand.SECONDARYOF, new RespCommandsInfo("SLAVEOF",    RespCommand.SECONDARYOF, 2, null)},
                { RespCommand.CONFIG, new RespCommandsInfo("CONFIG", RespCommand.CONFIG, 1, null, RespCommandFlags.None, 0, 0, 0, 
                        RespAclCategories.Slow, configCommandsInfoMap.Values.ToArray()) },
                {RespCommand.CLIENT,      new RespCommandsInfo("CLIENT",     RespCommand.CLIENT,      3, null)},
                {RespCommand.REGISTERCS,  new RespCommandsInfo("REGISTERCS", RespCommand.REGISTERCS, -4, null)},
            };

        private static readonly Dictionary<byte, RespCommandsInfo> sortedSetCommandsInfoMap = new Dictionary<byte, RespCommandsInfo>
        {
            {(byte)SortedSetOperation.ZADD,             new RespCommandsInfo("ZADD", RespCommand.SortedSet,             -3,null, (byte)SortedSetOperation.ZADD)},
            {(byte)SortedSetOperation.ZMSCORE,          new RespCommandsInfo("ZMSCORE", RespCommand.SortedSet,          -2,null, (byte)SortedSetOperation.ZMSCORE)},
            {(byte)SortedSetOperation.ZREM,             new RespCommandsInfo("ZREM", RespCommand.SortedSet,             -2,null, (byte)SortedSetOperation.ZREM)},
            {(byte)SortedSetOperation.ZCARD,            new RespCommandsInfo("ZCARD", RespCommand.SortedSet,             1,null, (byte)SortedSetOperation.ZCARD)},
            {(byte)SortedSetOperation.ZPOPMAX,          new RespCommandsInfo("ZPOPMAX", RespCommand.SortedSet,          -1,null, (byte)SortedSetOperation.ZPOPMAX)},
            {(byte)SortedSetOperation.ZSCORE,           new RespCommandsInfo("ZSCORE", RespCommand.SortedSet,            2,null, (byte)SortedSetOperation.ZSCORE)},
            {(byte)SortedSetOperation.ZCOUNT,           new RespCommandsInfo("ZCOUNT", RespCommand.SortedSet,            3,null, (byte)SortedSetOperation.ZCOUNT)},
            {(byte)SortedSetOperation.ZINCRBY,          new RespCommandsInfo("ZINCRBY", RespCommand.SortedSet,           3,null, (byte)SortedSetOperation.ZINCRBY)},
            {(byte)SortedSetOperation.ZRANK,            new RespCommandsInfo("ZRANK", RespCommand.SortedSet,             2,null, (byte)SortedSetOperation.ZRANK)},
            {(byte)SortedSetOperation.ZRANGE,           new RespCommandsInfo("ZRANGE", RespCommand.SortedSet,           -3,null, (byte)SortedSetOperation.ZRANGE)},
            {(byte)SortedSetOperation.ZRANGEBYSCORE,    new RespCommandsInfo("ZRANGEBYSCORE", RespCommand.SortedSet,    -3,null, (byte)SortedSetOperation.ZRANGEBYSCORE)},
            {(byte)SortedSetOperation.ZREVRANK,         new RespCommandsInfo("ZREVRANK", RespCommand.SortedSet,          2,null, (byte)SortedSetOperation.ZREVRANK)},
            {(byte)SortedSetOperation.ZREMRANGEBYLEX,   new RespCommandsInfo("ZREMRANGEBYLEX", RespCommand.SortedSet,    3,null, (byte)SortedSetOperation.ZREMRANGEBYLEX)},
            {(byte)SortedSetOperation.ZREMRANGEBYRANK,  new RespCommandsInfo("ZREMRANGEBYRANK", RespCommand.SortedSet,   3,null, (byte)SortedSetOperation.ZREMRANGEBYRANK)},
            {(byte)SortedSetOperation.ZREMRANGEBYSCORE, new RespCommandsInfo("ZREMRANGEBYSCORE", RespCommand.SortedSet,  3,null, (byte)SortedSetOperation.ZREMRANGEBYSCORE)},
            {(byte)SortedSetOperation.ZLEXCOUNT,        new RespCommandsInfo("ZLEXCOUNT", RespCommand.SortedSet,         3,null, (byte)SortedSetOperation.ZLEXCOUNT)},
            {(byte)SortedSetOperation.ZPOPMIN,          new RespCommandsInfo("ZPOPMIN", RespCommand.SortedSet,          -1,null, (byte)SortedSetOperation.ZPOPMIN)},
            {(byte)SortedSetOperation.ZRANDMEMBER,      new RespCommandsInfo("ZRANDMEMBER", RespCommand.SortedSet,      -1,null, (byte)SortedSetOperation.ZRANDMEMBER)},
            {(byte)SortedSetOperation.GEOADD,           new RespCommandsInfo("GEOADD", RespCommand.SortedSet,           -4,null, (byte)SortedSetOperation.GEOADD)},
            {(byte)SortedSetOperation.GEOHASH,          new RespCommandsInfo("GEOHASH", RespCommand.SortedSet,          -1,null, (byte)SortedSetOperation.GEOHASH)},
            {(byte)SortedSetOperation.GEODIST,          new RespCommandsInfo("GEODIST", RespCommand.SortedSet,          -3,null, (byte)SortedSetOperation.GEODIST)},
            {(byte)SortedSetOperation.GEOPOS,           new RespCommandsInfo("GEOPOS", RespCommand.SortedSet,           -1,null, (byte)SortedSetOperation.GEOPOS)},
            {(byte)SortedSetOperation.GEOSEARCH,        new RespCommandsInfo("GEOSEARCH", RespCommand.SortedSet,        -6,null, (byte)SortedSetOperation.GEOSEARCH)},
            {(byte)SortedSetOperation.ZREVRANGE,        new RespCommandsInfo("ZREVRANGE", RespCommand.SortedSet,        -3,null, (byte)SortedSetOperation.ZREVRANGE)},
            {(byte)SortedSetOperation.ZSCAN,            new RespCommandsInfo("ZSCAN", RespCommand.SortedSet,            -2,null, (byte)SortedSetOperation.ZSCAN)},
        };

        private static readonly Dictionary<byte, RespCommandsInfo> listCommandsInfoMap = new Dictionary<byte, RespCommandsInfo>
        {
            {(byte)ListOperation.LPUSH,     new RespCommandsInfo("LPUSH",   RespCommand.List,   -2, null, (byte)ListOperation.LPUSH)},
            {(byte)ListOperation.LPOP,      new RespCommandsInfo("LPOP",    RespCommand.List,   -1, null, (byte)ListOperation.LPOP)},
            {(byte)ListOperation.RPUSH,     new RespCommandsInfo("RPUSH",   RespCommand.List,   -2, null, (byte)ListOperation.RPUSH)},
            {(byte)ListOperation.RPOP,      new RespCommandsInfo("RPOP",    RespCommand.List,   -1, null, (byte)ListOperation.RPOP)},
            {(byte)ListOperation.LLEN,      new RespCommandsInfo("LLEN",    RespCommand.List,    1, null, (byte)ListOperation.LLEN)},
            {(byte)ListOperation.LTRIM,     new RespCommandsInfo("LTRIM",   RespCommand.List,    3, null, (byte)ListOperation.LTRIM)},
            {(byte)ListOperation.LRANGE,    new RespCommandsInfo("LRANGE",  RespCommand.List,    3, null, (byte)ListOperation.LRANGE)},
            {(byte)ListOperation.LINDEX,    new RespCommandsInfo("LINDEX",  RespCommand.List,    2, null, (byte)ListOperation.LINDEX)},
            {(byte)ListOperation.LINSERT,   new RespCommandsInfo("LINSERT", RespCommand.List,    4, null, (byte)ListOperation.LINSERT)},
            {(byte)ListOperation.LREM,      new RespCommandsInfo("LREM",    RespCommand.List,    3, null, (byte)ListOperation.LREM) },
        };

        private static readonly Dictionary<byte, RespCommandsInfo> hashCommandsInfoMap = new Dictionary<byte, RespCommandsInfo>
        {
            {(byte)HashOperation.HSET,          new RespCommandsInfo("HSET",            RespCommand.Hash,   -3,  null,   (byte)HashOperation.HSET) },
            {(byte)HashOperation.HMSET,         new RespCommandsInfo("HMSET",           RespCommand.Hash,   -3,  null,   (byte)HashOperation.HMSET)},
            {(byte)HashOperation.HGET,          new RespCommandsInfo("HGET",            RespCommand.Hash,    2,  null,   (byte)HashOperation.HGET)},
            {(byte)HashOperation.HMGET,         new RespCommandsInfo("HMGET",           RespCommand.Hash,   -2,  null,   (byte)HashOperation.HMGET)},
            {(byte)HashOperation.HGETALL,       new RespCommandsInfo("HGETALL",         RespCommand.Hash,    1,  null,   (byte)HashOperation.HGETALL)},
            {(byte)HashOperation.HDEL,          new RespCommandsInfo("HDEL",            RespCommand.Hash,   -2,  null,   (byte)HashOperation.HDEL)},
            {(byte)HashOperation.HLEN,          new RespCommandsInfo("HLEN",            RespCommand.Hash,    1,  null,   (byte)HashOperation.HLEN)},
            {(byte)HashOperation.HEXISTS,       new RespCommandsInfo("HEXISTS",         RespCommand.Hash,    2,  null,   (byte)HashOperation.HEXISTS)},
            {(byte)HashOperation.HKEYS,         new RespCommandsInfo("HKEYS",           RespCommand.Hash,    1,  null,   (byte)HashOperation.HKEYS)},
            {(byte)HashOperation.HVALS,         new RespCommandsInfo("HVALS",           RespCommand.Hash,    1,  null,   (byte)HashOperation.HVALS)},
            {(byte)HashOperation.HINCRBY,       new RespCommandsInfo("HINCRBY",         RespCommand.Hash,    3,  null,   (byte)HashOperation.HINCRBY)},
            {(byte)HashOperation.HINCRBYFLOAT,  new RespCommandsInfo("HINCRBYFLOAT",    RespCommand.Hash,    3,  null,   (byte)HashOperation.HINCRBYFLOAT)},
            {(byte)HashOperation.HSETNX,        new RespCommandsInfo("HSETNX",          RespCommand.Hash,    3,  null,   (byte)HashOperation.HSETNX)},
            {(byte)HashOperation.HRANDFIELD,    new RespCommandsInfo("HRANDFIELD",      RespCommand.Hash,   -1,  null,   (byte)HashOperation.HRANDFIELD)},
            {(byte)HashOperation.HSCAN,         new RespCommandsInfo("HSCAN",           RespCommand.Hash,   -2,  null,   (byte)HashOperation.HSCAN)},
             {(byte)HashOperation.HSTRLEN,      new RespCommandsInfo("HSTRLEN",         RespCommand.Hash,    2,  null,   (byte)HashOperation.HSTRLEN)},
        };

        private static readonly Dictionary<byte, RespCommandsInfo> setCommandsInfoMap = new Dictionary<byte, RespCommandsInfo>
        {
            {(byte)SetOperation.SADD,       new RespCommandsInfo("SADD",     RespCommand.Set,   -2, null, (byte)SetOperation.SADD)},
            {(byte)SetOperation.SMEMBERS,   new RespCommandsInfo("SMEMBERS", RespCommand.Set,    1, null, (byte)SetOperation.SMEMBERS)},
            {(byte)SetOperation.SREM,       new RespCommandsInfo("SREM",     RespCommand.Set,   -2, null, (byte)SetOperation.SREM)},
            {(byte)SetOperation.SCARD,      new RespCommandsInfo("SCARD",    RespCommand.Set,    1, null, (byte)SetOperation.SCARD)},
            {(byte)SetOperation.SPOP,       new RespCommandsInfo("SPOP",     RespCommand.Set,   -1, null, (byte)SetOperation.SPOP) },
            {(byte)SetOperation.SSCAN,      new RespCommandsInfo("SSCAN",    RespCommand.Set,   -2, null, (byte)SetOperation.SSCAN) },
        };

        private static readonly Dictionary<RespCommand, RespCommandsInfo> customCommandsInfoMap = new Dictionary<RespCommand, RespCommandsInfo>
        {
            {RespCommand.COSCAN,    new RespCommandsInfo("COSCAN",   RespCommand.All,   -2, null, (byte)RespCommand.COSCAN) },
        };

        private string GetRespFormatCommandInfo()
        {
            var sb = new StringBuilder();

            sb.Append("*10\r\n");
            // 1) Name
            sb.Append($"${this.nameStr.Length}\r\n{this.nameStr}\r\n");
            // 2) Arity
            sb.Append($":{this.arity}\r\n");
            // 3) Flags
            sb.Append($"*{this.strFlags.Length}\r\n");
            foreach (var flag in this.strFlags)
                sb.Append($"+{flag}\r\n");
            // 4) First key
            sb.Append($":{this.firstKey}\r\n");
            // 5) Last key
            sb.Append($":{this.lastKey}\r\n");
            // 6) Step
            sb.Append($":{this.step}\r\n");
            // 7) ACL categories
            sb.Append($"*{this.strAclCats.Length}\r\n");
            foreach (var aclCat in this.strAclCats)
                sb.Append($"+@{aclCat}\r\n");
            // 8) Tips (not currently supported)
            sb.Append("*0\r\n");
            // 9) Key specifications (not currently supported)
            sb.Append("*0\r\n");
            // 10) Subcommands
            sb.Append($"*{this.subcommands.Length}\r\n");
            foreach (var subcommand in subcommands)
                sb.Append(subcommand.respFormatCommandInfo);

            return sb.ToString();
        }

        public enum ConfigSubCommands : byte
        {
            GET,
            REWRITE,
            SET,
        }
    }

    /// <summary>
    /// Container for commands option information
    /// </summary>
    class RespCommandsOptionInfo
    {
        public readonly string nameStr;
        public readonly int arity;
        public readonly byte[] name;
        public readonly RespCommandOption option;


        public RespCommandsOptionInfo(string name, RespCommandOption opt, int ariry)
        {
            nameStr = name.ToUpper();
            this.name = System.Text.Encoding.ASCII.GetBytes(nameStr);
            this.option = opt;
            this.arity = ariry;
        }

        public static readonly RespCommandsOptionInfo[] optionMap = new RespCommandsOptionInfo[]
        {
            new RespCommandsOptionInfo("EX" ,RespCommandOption.EX, 2),
            new RespCommandsOptionInfo("NX" ,RespCommandOption.NX, 1),
            new RespCommandsOptionInfo("XX" ,RespCommandOption.XX, 1),
            new RespCommandsOptionInfo("GET" ,RespCommandOption.GET, 1),
            new RespCommandsOptionInfo("PX" ,RespCommandOption.PX, 2),
            new RespCommandsOptionInfo("EXAT" ,RespCommandOption.EXAT, 2),
            new RespCommandsOptionInfo("PXAT" ,RespCommandOption.PXAT, 2),
            new RespCommandsOptionInfo("PERSIST" ,RespCommandOption.PERSIST, 1),
            new RespCommandsOptionInfo("GT" ,RespCommandOption.GT, 1),
            new RespCommandsOptionInfo("LT" ,RespCommandOption.LT, 1),
        };
    }
}
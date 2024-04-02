// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace Garnet.common
{
    public static class EnumUtils
    {
        /// <summary>
        /// Get a mapping of each enum value name of type T to its description
        /// </summary>
        /// <typeparam name="T">Type of enum</typeparam>
        /// <returns>Map of enum value name to description</returns>
        public static IDictionary<string, string> GetEnumNameToDescription<T>() where T : Enum
        {
            var valToDesc = new Dictionary<string, string>();
            foreach (var flagFieldInfo in typeof(T).GetFields())
            {
                var descAttr = (DescriptionAttribute)flagFieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false).FirstOrDefault();
                if (descAttr != null)
                {
                    valToDesc.Add(flagFieldInfo.Name, descAttr.Description);
                }
            }

            return valToDesc;
        }
    }
}

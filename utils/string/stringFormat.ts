/**
 * https://github.com/Matt-Esch/string-template
 * @param {string} str
 * @param param
 * @return {string}
 * @example
 * ```js
 * greeting = stringFormat("Hello {name}, you have {count} unread messages", {
 *   name: "Robert",
 *   count: 12
 * })
 * // greeting -> "Hello Robert, you have 12 unread messages"
 *
 * // Format using a number indexed array
 *
 * greeting = stringFormat("Hello {0}, you have {1} unread messages", ["Robert", 12])
 * // greeting -> "Hello Robert, you have 12 unread messages"
 *
 * // Format using optional arguments
 *
 * greeting = stringFormat("Hello {0}, you have {1} unread messages",
 * "Robert",
 * 12)
 * // greeting -> "Hello Robert, you have 12 unread messages"
 *
 *
 * // Escape {} pairs by using double {{}}
 *
 * var text = stringFormat("{{0}}")
 * // text -> "{0}"
 * ```
 */

export interface IRegExpMatchArray extends Array<string> {
  index: number;
  input: string;
}

export function stringFormat(str: string, ...param: Record<string, any>[]): string {
  let args: Record<string, any>;

  if (param.length === 1 && typeof param[0] === "object") {
    args = param[0];
  } else {
    args = [...param];
  }

  if (!args || !args.hasOwnProperty) {
    args = {};
  }

  return str.replace(/{(\w+)}/g, function replaceArg(match: IRegExpMatchArray | string, k: string, index: number) {
    if (str[index - 1] === "{" && str[index + match.length] === "}") {
      return k;
    }
    const result = args.hasOwnProperty(k) ? args[k] : null;
    if (result === null || result === undefined) {
      return "";
    }

    return result;
  });
}

// 拼接产品参数
const items = [
  ["Self-cleaning mode, avoid the smell",""],
  ["Electrolytic water module, deep sterilization",""],
  ["High power motor, strong suction",""]
  ]
let result = {};
items.forEach((item, index) => {
  result[`"p${index + 1}"`] = `"${item[0]}"`;
});
console.log("{");
for (const key in result) {
  if (Object.hasOwnProperty.call(result, key)) {
    const element = result[key];
    console.log(`${key}:${element},`);

  }
}
console.log("}");


export default function transformer(file) {
  let src = file.source;

  src = src.replace('{{log}}', '{{console.log(this)}}');

  return src;
}

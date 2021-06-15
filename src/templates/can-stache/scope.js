
export default function transformer(file) {
  let src = file.source;

  src = src.replace(/[@%](index|key|element|event|viewModel|scope|arguments)\b/g, 'scope.$1');
  src = src.replace(/[@%]context/g, 'this');

  return src;
}

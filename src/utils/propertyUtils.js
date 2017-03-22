import preserveQuote from './preserveQuote';

export default {
  find(obj, propName) {
    return obj.properties.filter((p) => {
      if(p.key.type === 'Identifier') {
        return p.key.name === propName;
      } else if(p.key.type === 'Literal') {
        return p.key.value === propName;
      }
    })[0];
  },
  rename(obj, oldName, newName, forceLiteral) {
    const property = this.find(obj, oldName);
    if(property) {
      if(property.key.type === 'Identifier') {
        if(forceLiteral) {
        	property.key.value = newName;
	        property.key.type = 'Literal';
        } else {
        	property.key.name = preserveQuote(property.key.name, newName);
        }
      } else if(property.key.type === 'Literal') {
        property.key.value = newName;
      }
    }
  }
};

class A {
    constructor() {
        this.a = '1';
        this.b = '2';
    }
}
const aa = new A();
const a = Reflect.get(A, 'a');
const b = Reflect.get(aa, 'a');
console.log(a)
console.log(b)
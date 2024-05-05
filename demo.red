// fn fizzbuzz(n) {
//   let i = 1;
//   while i < n {
//     if i % 15 == 0 {
//       print("Fizzbuzz");
//     } else if i % 3 == 0 {
//       print("Fizz");
//     } else if i % 5 == 0 {
//       print("Buzz");
//     } else {
//       print(i);
//     }
//     i = i + 1;
//   }
// }

// fn sumFizzbuzz(n) {
//   let i = 1;
//   let sum = 0;
  
//   while i < n {
//     if i % 3 == 0 || i % 5 == 0 {
//       sum = sum + i;
//     }
//     i = i + 1;
//   }

//   print("sum: " + sum);
// }


// fn sumFibonacci(n) {
//   let lastNumber = 1;
//   let currentNumber = 2;
//   //  starting lastNumber + currentNumber
//   let sum = 2;
  
//   while currentNumber < n {
//     let temp = currentNumber;
//     currentNumber = lastNumber + temp;
//     lastNumber = temp;
    
//     if currentNumber < n && currentNumber % 2 == 0  {
//       sum = sum + currentNumber;
//     }
//   }

//   return sum;
// }

// let a = 4_000_000;
// print(sumFibonacci(a));

let a = 10;
while a < 20 {
  if a == 15 {
    a = a + 1;
    continue;
  }

  if a == 18 {
    a = a + 1;
    break;
  }

  print(a);
  a = a + 1;
}

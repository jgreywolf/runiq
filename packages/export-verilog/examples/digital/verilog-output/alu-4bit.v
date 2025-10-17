module ALU4bit
(
  input [3:0] a,
  input [3:0] b,
  input [1:0] op,
  output [3:0] result,
  output zero,
  output carry
);

  // Internal wires
  wire [3:0] add_result;
  wire [3:0] sub_result;
  wire [3:0] and_result;
  wire [3:0] or_result;

  // Module instances
  Adder4bit ADDER (
    .a(a),
    .b(b),
    .sum(add_result),
    .carry_out(carry)
  );
  Subtractor4bit SUBTRACTOR (
    .a(a),
    .b(b),
    .diff(sub_result)
  );
  ANDArray4bit AND_OP (
    .a(a),
    .b(b),
    .y(and_result)
  );
  ORArray4bit OR_OP (
    .a(a),
    .b(b),
    .y(or_result)
  );
  Mux4to1 #(
    .WIDTH(4)
  ) MUX (
    .sel(op),
    .in0(add_result),
    .in1(sub_result),
    .in2(and_result),
    .in3(or_result),
    .out(result)
  );

endmodule
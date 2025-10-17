module Counter4bit
#(
  parameter WIDTH = 4,
  parameter INIT = 0
)
(
  input clk,
  input reset,
  input enable,
  output [3:0] count
);

endmodule
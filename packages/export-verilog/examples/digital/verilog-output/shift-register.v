module ShiftRegister8bit
#(
  parameter WIDTH = 8
)
(
  input clk,
  input reset,
  input serial_in,
  input shift_enable,
  output serial_out,
  output [7:0] parallel_out
);

endmodule
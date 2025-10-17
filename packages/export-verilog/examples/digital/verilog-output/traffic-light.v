module TrafficLightController
(
  input clk,
  input reset,
  input sensor,
  output [1:0] north_south,
  output [1:0] east_west
);

  // Internal wires
  wire [2:0] state;
  wire [2:0] next_state;
  wire [7:0] timer;

endmodule
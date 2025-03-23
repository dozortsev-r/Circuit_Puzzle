import PySpice
from PySpice.Unit import *
import PySpice.Logging.Logging as Logging
from PySpice.Spice.Netlist import Circuit

def opanalysis(netlist):
    print(netlist)
    if len(netlist) == 0:
        return 0
    #need to manually add ground
    netlist += "G N5_9 0 0"
    circuit = Circuit('Circuit Puzzle Tool')
    logger = Logging.setup_logging()
    nodes_set = set()
    resistors = set()
    
    lines = netlist.split('\n')
    for line in lines:
        print("this is the line, ", line)
        words = line.split(' ')
        try:
            node1 = words[1]
            node2 = words[2]

            if words[1] == '0':
                node1 = circuit._ground
            if words[2] == '0':
                node2 = circuit._ground

            nodes_set.add(node1)
            nodes_set.add(node2)

            if line[0] == 'R': #resistor
                resistors.add(circuit.R(words[0][1:], node1, node2, int(words[3]) @ u_Ohm))
            elif line[0] == 'V': #voltage
                circuit.V(words[0][1:], node1, node2, int(words[3]) @ u_V)
            elif line[0] == 'I': #current 
                circuit.I(words[0][1:], node1, node2, int(words[3]) @ u_A)
            elif line[0] == 'C': #capacitor
                circuit.C(words[0][1:], node1, node2, int(words[3]) @ u_F)
            elif line[0] == 'L': #inductor
                circuit.L(words[0][1:], node1, node2, int(words[3]) @ u_H)
            else:
                pass
        except(IndexError):
            pass
    
    for resistor in resistors:
        resistor.plus.add_current_probe(circuit)
#     print(circuit)

    simulator = circuit.simulator(temperature=25, nominal_temperature=25)
    analysis = simulator.operating_point() # ERROR OCCURING HERE often means that no ground was designated, check netlist
#     if you get errors here make sure to run after navigating to where your python files are stored. You may have to run the function with a ./ in front
#                                         pyspice-post-installation --install-ngspice-dll
#                                         to properly install ngspice
    # print(nodes_set)

    print("got here")
    output = ''
    print("this is ", nodes_set)
    for node in nodes_set:
        if node != 0: # can't index node 0 (ground), and the voltage is always 0 there anyways
            n = node.lower()
            print(n)
            print(analysis.nodes[n])
            output += (str(analysis.nodes[n]) + ' ')

            print(float(analysis.nodes[n]))
            output += (str(float(analysis.nodes[n])) + ' V \n')
        else:
            output += ('n000 ')
            output += '0 V\n'

    for node in analysis.branches.values():
        output += '\n' + str(node) + ' '
        output += str(float(node))
    return output

# totry = "R_R1 N_0002 N_0001 1\n"
# totry += "R_R2 N_0003 N_0001 5\n" + "R_R3 N_0003 N_0001 10\n" + "R_R4 N_0003 0 0\n" + "V_V1 N_0002 N_0003 20"

# print("final value\n", opanalysis(totry))
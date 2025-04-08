import PySpice
from PySpice.Unit import *
import PySpice.Logging.Logging as Logging
from PySpice.Spice.Netlist import Circuit

def opanalysis(netlist):
    print(netlist)
    if len(netlist) == 0:
        return 0
    #need to manually add ground
    #netlist += "G N5_9 0 0"
    circuit = Circuit('Circuit Puzzle Tool')
    logger = Logging.setup_logging()
    nodes_set = set()
    resistors = set()
    
    lines = netlist.split('\n')
    #lines.append("r5 N3 0 0")
    print(lines)
    for line in lines:
        if line == '':
            continue
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

            if line[0] == 'r': #resistor
                resistors.add(circuit.R(words[0][1:], node1, node2, int(words[3]) @ u_Ohm))
            elif line[0] == 'v': #voltage
                circuit.V(words[0][1:], node1, node2, int(words[3]) @ u_V)
            elif line[0] == 'i': #current 
                circuit.I(words[0][1:], node1, node2, int(words[3]) @ u_A)
            elif line[0] == 'c': #capacitor
                circuit.C(words[0][1:], node1, node2, int(words[3]) @ u_F)
            elif line[0] == 'l': #inductor
                circuit.L(words[0][1:], node1, node2, int(words[3]) @ u_H)
            else:
                pass
        except(IndexError):
            pass
    has_ground = any(' 0' in line or ' 0 ' in line for line in lines)

    if not has_ground:
        # pick any node and connect it to 0 via a very small resistor
        first_node = list(nodes_set)[0]
        circuit.R('gndtie', first_node, circuit._ground, 0.001 @ u_Ohm)
        print(f"[INFO] Injected grounding resistor between {first_node} and 0")
    
    for resistor in resistors:
        resistor.plus.add_current_probe(circuit)

    simulator = circuit.simulator(temperature=25, nominal_temperature=25)
    analysis = simulator.operating_point() # ERROR OCCURING HERE often means that no ground was designated, check netlist
#     if you get errors here make sure to run after navigating to where your python files are stored. You may have to run the function with a ./ in front
#                                         pyspice-post-installation --install-ngspice-dll
#                                         to properly install ngspice
#                                         need to brew install ngspice

    output = ''
    for node in nodes_set:
        if node != 0: # can't index node 0 (ground), and the voltage is always 0 there anyways
            n = node.lower()
            output += (str(analysis.nodes[n]) + ' ')
            output += (str(float(analysis.nodes[n])) + ' V \n')
        else:
            output += ('n000 ')
            output += '0 V\n'

    for node in analysis.branches.values():
        output += '\n' + str(node) + ' '
        output += str(float(node))
    print('final output', output)
    return output


#correct:
# totry = "r1 N2 N1 1\nr2 N3 N1 5\nr3 N3 N1 10\nr4 N3 0 0\nv1 N2 N3 20"
# print("final value correct:\n", opanalysis(totry))

# #current one mine is producing (everything is backwards):
# totry = "r1 N2 N1 1\nr2 N3 N1 5\nr3 N3 N1 10\nv1 N2 N3 20"
# totry = "r1 N1 N2 5\nr2 N1 N2 1\nr4 N1 N2 10\nv3 N3 N2 20"
# print("\n\nfinal value incorrect:\n", opanalysis(totry))


# r1 N1 N2 5
# r2 N1 N2 1
# v3 N3 N2 20
# r4 N1 N2 10
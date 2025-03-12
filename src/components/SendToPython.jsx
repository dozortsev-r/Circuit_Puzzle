
export default function SendToPython(net, node_list, comp_list) {
    $.ajax({
        type: 'POST',
        url: "/opa",
        data: { // parameters to send into python
            netlist: net
        },
        success: function (response) {
            console.log('succeeded',response)
            // DisplayValues(response, node_list, comp_list)
            return response
        }
    })
}
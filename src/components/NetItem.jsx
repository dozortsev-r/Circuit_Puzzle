export default class NetItem {
    constructor(component, netnum, matrix) {
        this.component = component
        this.matrix = matrix
        this.abbreviation = this.find_type()
        this.component.netitem = this
        this.reference = netnum
        this.node1 = null
        this.node2 = null
        this.string = null
    }

    create_string() {
        console.log(this.component)
        this.string = this.abbreviation + this.reference + ' ' + this.node1.string +  ' ' + this.node2.string +  ' ' + this.find_value()
    }

    flip_nodes() {
        let temp = this.node1
        this.node1 = this.node2
        this.node2 = temp
    }
    find_value() {
        let component =  this.matrix[this.component.row][this.component.col]
        if(component.type.includes('resistor')){
            return component.resistance
        } else if (component.type.includes('voltage')){
            return component.voltage
        }
        return 0
    }
    find_type() {
        if (this.component.type.includes("resistor")) {
            return 'r'
        } else if (this.component.type.includes("voltage")){
            return 'v'
        } else if (this.component.type.includes("ground")){
            return 'g'
        }
    }
}
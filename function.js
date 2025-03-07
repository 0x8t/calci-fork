let newTrue = false;
let brac_count=0;
        
        function Display_d(value) {
            let display=document.getElementById('display')
            expression=display.value;
            
            if (newTrue) {
                Clear();
                newTrue = false;
            }
            if(value==')')
            {
                brac_count--;
            }
            if(value=='(')
            {
                brac_count++;
            }
            if(value.endsWith('sin')||value.endsWith('cos')||value.endsWith('tan'))
            {
                brac_count++;
            }
            document.getElementById('display').value+= value;
        }
        
        function Clear() {
            document.getElementById('display').value = '';
            newTrue = false;
        }
        
        function Solve() {
            try {
                let display=document.getElementById('display')
                expression=display.value;
                while(brac_count)
                {
                    expression+=')';
                    brac_count--;
                }    
                expression=expression.replace(/sin\(([^)]+)\)/g,(match,angle) => Math.sin(parseFloat(angle)*(3.14/180)));
                expression=expression.replace(/cos\(([^)]+)\)/g,(match,angle) => Math.cos(parseFloat(angle)*(3.14/180)));
                expression=expression.replace(/tan\(([^)]+)\)/g,(match,angle) => Math.tan(parseFloat(angle)*(3.14/180)));
                document.getElementById('display').value = eval(expression);
                newTrue = true;
            } catch {
                document.getElementById('display').value = 'Error';
                newTrue = true;
            }
        }
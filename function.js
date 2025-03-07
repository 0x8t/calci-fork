let newTrue = false;
        
        function Display_d(value) {
            if (newTrue) {
                Clear();
                newTrue = false;
            }
            document.getElementById('display').value += value;
        }
        
        function Clear() {
            document.getElementById('display').value = '';
            newTrue = false;
        }
        
        function Solve() {
            try {
                document.getElementById('display').value = eval(document.getElementById('display').value);
                newTrue = true;
            } catch {
                document.getElementById('display').value = 'Error';
                newTrue = false;
            }
        }
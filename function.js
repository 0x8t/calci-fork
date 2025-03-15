let newTrue = false;
let brac_count=0;
let decimal_accuracy=2;

//for counting no. of times check's elements occur in exp
function fun_count(exp,check)
{
    let count=0;
    for(let j=0;j<check.length;j++)
    {
        for(let i=0;i<exp.length-check[j].length;i++)
        {        
            if(exp.substring(i,i+check[j].length)==check[j])
            {
                count++;
                i+=check[j].length;
            }
        }
    }
    return count;
}

//function to remove extra plus
function Rem_plus(exp)
{
    let exp_NoPlus=exp;
    let operators = ['+','-','x','*','/','%','^','√','sin','cos','tan','log','(','b)','b','b)(']
    for(let j=0;j<operators.length;j++)
    {
        for(let i=0;i<exp_NoPlus.length;i++)
        {
            if((exp_NoPlus.substring(i,i+operators[j].length)==operators[j]&&exp_NoPlus[i+operators[j].length]=="+")||i==0&&exp_NoPlus[i]=='+')
            {
                exp_NoPlus=exp_NoPlus.substring(0,i+operators[j].length)+exp_NoPlus.substring(i+operators[j].length+1,exp_NoPlus.length);
                i+=operators[j].length-1;
            }
        }
    }
    return exp_NoPlus;
}

//function checking whether a character is eithernumber or decimal
function isDigit(char) 
{
    return (char >= '0' && char <= '9')||char=='.';
}

//function to add multiplication between 2 bracket closing and just opening without any operator
function Add_mul_brac(exp)
{
    let exp_brac=exp;
    for(let i=0;i<exp_brac.length-1;i++)
    {
        if((exp_brac.substring(i,i+2)==")(" && exp_brac[i-1]!="b")||(exp_brac[i]==')'&&isDigit(exp_brac[i+1])&&exp_brac[i-1]!='b')||(exp_brac[i+1]=='('&&isDigit(exp_brac[i]))||((exp_brac[i]==')'||isDigit(exp_brac[i]))&&(exp_brac.substring(i+1,i+4)=="sin"||exp_brac.substring(i+1,i+4)=="cos"||exp_brac.substring(i+1,i+4)=="tan"||exp_brac.substring(i+1,i+4)=="log")))
        {
            exp_brac=exp_brac.substring(0,i+1)+'x'+exp_brac.substring(i+1,exp_brac.length);
        }
    }
    return exp_brac;
}

//function for evaluating each bracket
function Evaluate(exp)
{

    let new_exp=exp.substring(1,exp.length-1);
    let fun_times=fun_count(new_exp,['√','^'])
    
    for(let j=0;j<fun_times;j++)
    {
        new_exp = new_exp.replace(/(-?\d+(\.\d+)?)\^(-?\d+(\.\d+)?)/g, (match, base, _, exponent) => {
            base = parseFloat(base);
            exponent = parseFloat(exponent);
        
            // Handle cases where negative bases with non-integer exponents cause issues
            if (base < 0 && !Number.isInteger(exponent)) {
                return "Math Error!"; // Negative base raised to non-integer exponent results in complex number
            }
            result = Math.pow(base, exponent);
        
            return parseFloat(result.toFixed(decimal_accuracy));
        });        
        
        new_exp = new_exp.replace(/(-?\d+(\.\d+)?)√(-?\d+(\.\d+)?)/g, (match, base, _, exponent) => {
            base = parseFloat(base);  // Root (degree)
            exponent = parseFloat(exponent); // Radicand (number under root)
        
            // Prevent zero as a root (0√x is undefined)
            if (base == 0) {
                return "Math Error!";
            }
        
            // If the radicand (exponent) is negative and the root is even, return an error
            if (exponent < 0 && base % 2 == 0) {
                return "Math Error!"; // Even roots of negative numbers are not real
            }
        
            // Correct handling of negative numbers for odd roots
            let result;
            if (exponent < 0) {
                result = -Math.pow(-exponent, 1 / base); // Compute root on positive part, then negate
            } else {
                result = Math.pow(exponent, 1 / base);
            }
        
            return parseFloat(result.toFixed(decimal_accuracy));
        });     
           
    }

    
    fun_times=fun_count(new_exp,['sin','cos','tan','log'])
    for(let j=0;j<fun_times;j++)
    {
        new_exp=new_exp.replace(/sin-?\d+(\.\d+)?/gi, (match) => {
            let num = match.replace("sin", "");
            return Math.sin(parseFloat(num) * (Math.PI / 180)).toFixed(decimal_accuracy); });
        
        
        new_exp=new_exp.replace(/tan-?\d+(\.\d+)?/gi, (match) => {
            let num = match.replace("tan", "");
            let radians = parseFloat(num) * (Math.PI / 180);
            let tanValue = Math.tan(radians);
        
            // Handle large values (like tan(90) which approaches infinity)
            if (parseFloat(num)==90) 
            {
                document.getElementById('display').value="Math Error!";
                newTrue = true;
                return;
            }
        
            return tanValue.toFixed(decimal_accuracy);
        });

        new_exp = new_exp.replace(/cos-?\d+(\.\d+)?/gi, (match) => {
            let num = match.replace("cos", ""); // Remove 'cos' to extract the number
            return Math.cos(parseFloat(num) * (Math.PI / 180)).toFixed(decimal_accuracy);
        });


        if (/log-?\d+(\.\d+)?b-?\d+(\.\d+)?/.test(new_exp)) {
            new_exp = new_exp.replace(/log(-?\d+(\.\d+)?)b(-?\d+(\.\d+)?)/gi, (match, base, _, num) => {
                base = parseFloat(base);
                num = parseFloat(num);
            newTrue=false;
    
                if (base <= 0 || base == 1 || num <= 0) {

                    document.getElementById('display').value = "log undefined!";
                    newTrue = true;
                    return match; // Return the original expression unchanged
                }
        
                let logValue = Math.log(num) / Math.log(base);
                return parseFloat(logValue.toFixed(decimal_accuracy));
            });

            if (newTrue) return; // **Stops execution if log is undefined**
        }
        
    }

    fun_times=fun_count(new_exp,['/','%'])
    document.getElementById('display').value=fun_times;
    for(let j=0;j<fun_times;j++)
    {
        new_exp = new_exp.replace(/(-?\d+(\.\d+)?)\/(-?\d+(\.\d+)?)/g, (match, num1, _, num2) => {
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
            
            newTrue=false;
            if (num2 == 0) {
                document.getElementById('display').value = "Division by 0!"; // Handling division by zero
                newTrue = true;

                return match; // **Prevents "undefined" from appearing in new_exp**
            }
        
            let divValue = num1/num2;
            return divValue.toFixed(decimal_accuracy);
        });
        
        new_exp = new_exp.replace(/(-?\d+(\.\d+)?)\%(-?\d+(\.\d+)?)/g, (match, num1, _, num2) => {
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
        
            if (num2 == 0) {
                document.getElementById('display').value = "Modulus by 0!"; // Handling modulus by zero
                newTrue = true;
                return match; // **Prevents "undefined" from appearing in new_exp**
            }
        
            let modValue = num1 % num2;
            return modValue.toFixed(decimal_accuracy);
        });
        if (newTrue) return;
        
    }
    
    fun_times=fun_count(new_exp,['*','x'])
    for(let j=0;j<fun_times;j++)
    {
        new_exp = new_exp.replace(/(-?\d+(\.\d+)?)\x(-?\d+(\.\d+)?)/g, (match, num1, _, num2) => {
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
        
            let mulValue = num1 * num2;
            return mulValue.toFixed(decimal_accuracy);
        });
        
        new_exp = new_exp.replace(/(-?\d+(\.\d+)?)\*(-?\d+(\.\d+)?)/g, (match, num1, _, num2) => {
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
        
            let mulValue = num1 * num2;
            return mulValue.toFixed(decimal_accuracy);
        });
        
    }

    fun_times=fun_count(new_exp,['+','-'])
    for(let j=0;j<fun_times;j++)
    {
        new_exp=new_exp.replace(/(-?\d+(\.\d+)?)\+(-?\d+(\.\d+)?)/g, (match, num1, _, num2) => {
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
        
            let sumValue = num1 + num2;
            return sumValue.toFixed(decimal_accuracy);
        });
        new_exp=new_exp.replace(/(-?\d+(\.\d+)?)\-\s*(-?\d+(\.\d+)?)/g, (match, num1, _, num2) => {
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
        
            let diffValue = num1 - num2;
            return diffValue.toFixed(decimal_accuracy);
        });
    }

    newTrue=true;
    return(new_exp);
}

//function to add + sign before every minus
function Plus_add(exp)
{
    let new_update=exp;
    for(let i=0;i<new_update.length;i++)
    {
        if(new_update[i]=='-'&&new_update[i-1]!='+'&&i!=0)
            new_update=new_update.substring(0,i)+'+'+new_update.substring(i,);
    }
    return new_update;
}

//function controlling main display
function Display_d(value) 
{
    if(newTrue) {
        Clear();
        newTrue = false;
    }
    document.getElementById('display').value+= value;
}

//function for 'C'
function Clear() 
{
    document.getElementById('display').value = '';
    newTrue = false;
    total_brac_count=0;
}

//function for 'DELETE'
function Clear_char() 
{
    let display=document.getElementById('display')
    let expression=display.value;
    if(expression.endsWith('sin(')||expression.endsWith('cos(')||expression.endsWith('tan(')||expression.endsWith('(2)√'))
    {
        document.getElementById('display').value = expression.substring(0,expression.length-4);
    }
    else if(expression.endsWith('log'))
    {
        document.getElementById('display').value = expression.substring(0,expression.length-3);
    }
    else
    {
        document.getElementById('display').value = expression.substring(0,expression.length-1);
    }
    newTrue = false;
    total_brac_count=0;
}

//function which will run on pressing '='
function Solve() 
{
    
    Set_accuracy();
    try {
        let stack=[];
        let subpart="";
        let valpart="";
        let display=document.getElementById('display')
        let expression=display.value;
        if(newTrue)
            Clear();    

        //to remove plus from start of expression
        if(expression[0]=='+')
            expression=expression.substring(1,);


        //closing all opened brackets
        let i=0;
        while(i<expression.length)
        {
            if(expression[i]=='(')
            {
                brac_count++;
            }
            else if(expression[i]==')')
            {
                brac_count--;
                if(brac_count<0)
                {
                    document.getElementById('display').value = "Extra Closing Parentheses Detected";
                    newTrue = true;
                    return;
                }
            }
            i++;
        }

        while(brac_count)
        {
            expression+=')';
            brac_count--;
        }

        //replacing e with Math.E
        if(!newTrue)
            expression = expression.replace(/e/g, `(${Math.E})`);

        //adding + before every minus
        expression=Plus_add(expression);

        //removing unnecessary + signs
        expression=Rem_plus(expression);

        //function to add x between )( except for log(...b)(..)
        expression = Add_mul_brac(expression);

        i=0;
        while(i<expression.length)
        {
            if(expression[i]=='(')
            {
                stack.push(i);
            }
            i++;
        }

        //evaluating expression
        i=stack[stack.length-1];
        while(stack.length>0)
        {
            if(expression[i]==')')
            {
                subpart=expression.substring(stack[stack.length-1],i+1);
                valpart=Evaluate(expression.substring(stack[stack.length-1],i+1));
                if(valpart==undefined)
                {
                    newTrue = true;
                    return;
                }
                expression=expression.replace(subpart,valpart);   
                stack.pop();
                if(stack.length!=0)
                {
                    i=stack[stack.length-1];
                }
            }
            i++;
        }
        
        expression="("+expression+")"
        expression=Evaluate(expression);
        if(expression==undefined)
        {
            newTrue=true;
            return;
        }
        


        //printing expression
        document.getElementById('display').value = expression;

        newTrue = true;
    } catch {
        document.getElementById('display').value = 'Error';
        newTrue = true;
    }
}

//function to handle enter key for '='
function Enter(event) 
{
    if (event.key === "Enter") 
    {
        Solve();
    }
}

//function to handle decimal accuracy button
function Set_accuracy() 
{
    let input=parseInt(document.getElementById('displayAccuracy').value);
    if(input>=0) 
    {
        decimal_accuracy=input;
    }
    else if(document.getElementById('displayAccuracy').value=="")
    {
        decimal_accuracy=2;
    }
    else
    {
        document.getElementById('displayAccuracy').value="!!!";
        decimal_accuracy=2;
    }
}
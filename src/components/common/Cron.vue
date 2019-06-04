<template>
    <el-form class="cron-container"
        :model="ruleForm"
        ref="ruleForm"
        label-width="90px"
        :rules="rules">
        <el-form-item label="计划类型">
            <el-radio-group v-model="ruleForm.planType">
                <el-radio label="执行一次"></el-radio>
                <el-radio label="重复执行"></el-radio>
            </el-radio-group>
        </el-form-item>
        <template v-if="ruleForm.planType == '执行一次'">
            <dialog-item-title title="执行一次"></dialog-item-title>
            <el-form-item label="日期时间:">
                <el-date-picker
                    :picker-options="pickOption"
                    v-model="ruleForm.onceDateTime"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
        </template>
        <template v-else>
            <dialog-item-title title="周期"></dialog-item-title>
            <el-form-item label="执行">
                 <!-- @change="clearCycle" -->
                <el-select v-model="ruleForm.cycle">
                    <el-option
                        v-for="item in cycleSelect"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="执行间隔" prop="interval">
                <el-input v-model="ruleForm.interval"></el-input>
            </el-form-item>
            <el-form-item
            label=""
            v-if="ruleForm.cycle!='day' && ruleForm.cycle!='year'"
            prop="intervalSelect">
                在
                <div class="cron-tag-container">
                    <el-select
                        v-model="ruleForm.intervalSelect"
                        multiple
                        placeholder="请选择">
                        <el-option
                        v-for="item in intervalOption"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item label="执行日期"
                v-if="ruleForm.cycle=='year'"
                prop="intervalDate">
                <el-date-picker
                    v-model="ruleForm.intervalDate"
                    type="date"
                    format="MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <dialog-item-title title="每天频率"></dialog-item-title>
            <el-form-item label="执行间隔" prop="dayInterval">
                <el-col :span="8">
                    <el-input v-model="ruleForm.dayInterval"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="ruleForm.dayType">
                        <el-option label="小时" value="hour"></el-option>
                        <el-option label="分" value="minutes"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="开始时间" prop="dayStartTime">
                <el-time-picker
                    v-model="ruleForm.dayStartTime"
                    placeholder="选择时间">
                </el-time-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="dayEndTime">
                <el-time-picker
                    v-model="ruleForm.dayEndTime"
                    placeholder="选择时间">
                </el-time-picker>
            </el-form-item>
            <dialog-item-title title="有效时间"></dialog-item-title>

            <el-form-item label="开始日期" prop="validateStartDate">
                <el-col :span="10">
                    <el-date-picker
                        :picker-options="pickOption"
                        v-model="ruleForm.validateStartDate"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="14" class="start-end-date">
                    <el-radio-group v-model="hasEndDate">
                        <el-form-item prop="validateEndDate">
                            <el-radio label="结束日期"></el-radio>
                            <el-date-picker
                                v-model="ruleForm.validateEndDate"
                                placeholder="选择日期"
                                :disabled="hasEndDate == '无结束日期'">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item style="margin-bottom:0 !important;">
                            <el-radio label="无结束日期"></el-radio>
                        </el-form-item>
                    </el-radio-group>
                </el-col>
                <Error tip="开始日期不能大于结束日期" :visible="errorVisible"></Error>
            </el-form-item>
            <!-- <el-form-item label="">
                <el-radio-group v-model="hasEndDate">
                    <el-form-item prop="validateEndDate">
                        <el-radio label="结束日期"></el-radio>
                        <el-date-picker
                            v-model="ruleForm.validateEndDate"
                            placeholder="选择日期"
                            :disabled="hasEndDate == '无结束日期'">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-radio label="无结束日期"></el-radio>
                    </el-form-item>
                </el-radio-group>
            </el-form-item> -->
        </template>
        <dialog-item-title title="摘要"></dialog-item-title>
        <el-form-item label="说明">
            <el-input type="textarea"
                    v-model="summary"
                    :readonly="true"
                    placeholder="根据完整的参数，自动生成说明">
            </el-input>
        </el-form-item>
        <div class="cron-footer">
            <el-button @click="submitCron" type="primary">确定</el-button>
            <el-button @click="$store.dispatch('closeDialog', false)">取消</el-button>
        </div>
    </el-form>
</template>
<script>
    // import 'assets/js/CronGen.min.js'
    import dialogItemTitle from 'common/dialogItemTitle'
    import Error from 'common/Error'
    export default{
        name: 'Cron',
        data(){
            return {
                errorVisible: false,
                pickOption: {
                    disabledDate(data){
                        return data.getTime() < Date.now() - 60*60*24*1000
                    }
                },
                cycleSelect: [
                    {label: '每日', value: 'day'},
                    {label: '每月', value: 'month'},
                    {label: '每周', value: 'week'},
                    {label: '每年', value: 'year'}
                ],
                hasEndDate: '结束日期',
                intervalOption: [
                    {label: '星期一', value: 'Mon'},
                    {label: '星期二', value: 'Tue'},
                    {label: '星期三', value: 'Wed'},
                    {label: '星期四', value: 'Thur'},
                    {label: '星期五', value: 'Fri'},
                    {label: '星期六', value: 'Sat'},
                    {label: '星期日', value: 'Sun'},
                ],
                ruleForm: {
                    planType: '重复执行',
                    onceDateTime: '',

                    cycle: 'day',
                    interval: 1,
                    intervalSelect: [],
                    intervalDate: null,
                    dayInterval: 1,
                    dayType: 'hour',
                    dayStartTime: '',
                    dayEndTime: '',
                    validateStartDate: '',
                    validateEndDate: '',
                    summary: ''
                },
                rules: {
                    onceDateTime: [{ required: true, message: '请选择日期时间' }],
                    interval: [{ required: true, message: '请输入执行间隔' }],
                    intervalSelect: [{ required: true, message: '请选择周期' }],
                    intervalDate: [{ required: true, message: '请输入执行日期' }],
                    dayInterval: [{ required: true, message: '请输入执行间隔' }],
                    dayStartTime: [{ required: true, message: '请输选择开始时间'  }],
                    dayEndTime: [{ required: true, message: '请输选择结束时间' }],
                    validateStartDate: [{ required: true, message: '请选择有效时间开始日期' }],
                    validateEndDate: [{
                        required: this.hasEndDate == '结束日期' ?  true : false,
                        message: '请选择有效时间结束日期' }],
                },
                cron: '',
                map: new Map([
                    ['seconds', '*'],
                    ['minutes', '*'],
                    ['hours', '*'],
                    ['day', '*'],
                    ['month', '*'],
                    ['week', '?'],
                    ['year', '*'],
                ])
            }
        },
        watch: {
            'ruleForm.validateEndDate'(val){
                let start = this.ruleForm.validateStartDate
                let end = val
                if(start && start >= end){
                    this.errorVisible = true
                }else if(start && start < end){
                    this.errorVisible = false
                }
            },
            'ruleForm.validateStartDate'(val){
              let start = val
              let end = this.ruleForm.validateEndDate
              if(end && start >= end ){
                  this.errorVisible = true
              }else if(end && start < end){
                  this.errorVisible = false
              }
            },
            hasEndDate(){
                this.ruleForm.validateEndDate = ''
            },
            'ruleForm.cycle'(val){
                // this.clearCycle()
                if(val == 'week'){
                    this.intervalOption = [
                        {label: '星期一', value: 'MON'},
                        {label: '星期二', value: 'TUE'},
                        {label: '星期三', value: 'WED'},
                        {label: '星期四', value: 'THU'},
                        {label: '星期五', value: 'FRI'},
                        {label: '星期六', value: 'SAT'},
                        {label: '星期日', value: 'SUN'},
                    ]
                }else if(val == 'month'){
                    for(let i = 1; i<31; i++){
                        const item = {label: i+'', value: i+''}
                        this.intervalOption.push(item)
                    }
                }
            }
        },
        components: {
            dialogItemTitle,
            Error
        },
        computed: {
            cronValue(){
                let value = this.$store.state.cronValue.split(' ')
                value = value.map(val => {
                    if(/(\*|\/|\?|\-)/.test(val)){
                        return val
                    }else{
                        return +val
                    }
                })
                if(this.ruleForm.planType = '重复执行'){
                    this.setRepeatDate()
                }else{
                    this.ruleForm.onceDateTime = new Date(value[6], value[4]-1, value[3], value[2], value[1], value[0])
                }
                return value
            },
            summary(){
                let content = ''
                if(this.ruleForm.planType == '执行一次' && this.ruleForm.onceDateTime){
                    const time = this.ruleForm.onceDateTime
                    const showDate = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}-${time.getSeconds()}`
                    content = `任务执行时间是 [ ${showDate} ]`
                }else{
                    // 任务执行间隔是[ 1 天 ]。在[ 18:14:00 ]开始执行。在[ 18:14:30 ]结束。频率[ 1小时 ]。开始日期是[ 2017-10-17 ]。结束日期是[ 2017-11-07 ]。
                    //单位
                    let type = '天'
                    switch (this.ruleForm.cycle){
                        case 'day':
                            type = '天'
                            break
                        case 'week':
                            type = '周'
                            break
                        case 'month':
                            type = '月'
                            break
                        case 'year':
                            type = '年'
                            break
                    }

                    content += `任务执行间隔是[${this.ruleForm.interval}${type}]。`

                    if(this.ruleForm.cycle == 'week' || this.ruleForm.cycle == 'month'){
                        content += `在[${this.ruleForm.intervalSelect.join(',')}]开始执行`
                    }else if(this.ruleForm.cycle == 'year'&&this.ruleForm.intervalDate&&this.ruleForm.intervalDate){
                        content += `在[${this.checkTime(this.ruleForm.intervalDate.getMonth())+1}-${this.checkTime(this.ruleForm.intervalDate.getDate())}]开始执行`
                    }
                    let start = this.ruleForm.dayStartTime && `${this.checkTime(this.ruleForm.dayStartTime.getHours())}:${this.checkTime(this.ruleForm.dayStartTime.getMinutes())}:${this.checkTime(this.ruleForm.dayStartTime.getSeconds())}`
                    let end = this.ruleForm.dayEndTime && `${this.checkTime(this.ruleForm.dayEndTime.getHours())}:${this.checkTime(this.ruleForm.dayEndTime.getMinutes())}:${this.checkTime(this.ruleForm.dayEndTime.getSeconds())}`
                    if(start){
                        content += `在[ ${start} ]开始执行。`
                    }
                    if(end){
                        content += `在[ ${end} ]结束。`
                    }
                    let startDate = this.ruleForm.validateStartDate && `${this.ruleForm.validateStartDate.getFullYear()}-${this.checkTime(this.ruleForm.validateStartDate.getMonth())+1}-${this.checkTime(this.ruleForm.validateStartDate.getDate())}`
                    let endDate = this.ruleForm.validateEndDate && `${this.ruleForm.validateEndDate.getFullYear()}-${this.checkTime(this.ruleForm.validateEndDate.getMonth())+1}-${this.checkTime(this.ruleForm.validateEndDate.getDate())}`
                    if(startDate){
                        content += `开始日期是[ ${startDate} ]。`
                    }
                    if(endDate){
                        content += `结束日期是[ ${endDate} ]。`
                    }
                }
                this.$store.dispatch('showCron', content)
                return content
            },
            cronMap(){
                //执行一次和重复执行
                if(this.ruleForm.planType == '执行一次' && this.ruleForm.onceDateTime){
                    const onceDateTime = this.ruleForm.onceDateTime
                    this.map.set('seconds', onceDateTime.getSeconds())
                    this.map.set('minutes', onceDateTime.getMinutes())
                    this.map.set('hours', onceDateTime.getHours())
                    this.map.set('day', onceDateTime.getDate())
                    this.map.set('month', onceDateTime.getMonth()+1)
                    this.map.set('year', onceDateTime.getFullYear())
                }else{
                    this.setCycle()
                    this.setinterval()
                    //周期
                    switch (this.ruleForm.cycle){
                        case 'day': {
                            this.map.set('day', `*/${this.ruleForm.interval}`)
                            break
                        }
                        case 'week': {
                            this.map.set('week',`${this.ruleForm.intervalSelect.join(',')}/${this.ruleForm.interval}`)
                            break
                        }
                        case 'month': {
                            this.map.set('month',`${this.ruleForm.intervalSelect.join(',')}/${this.ruleForm.interval}`)
                            break
                        }
                        case 'year': {
                            this.map.set('year', `*/${this.ruleForm.interval}`)
                            const executeDate = this.ruleForm.intervalDate
                            if(executeDate){
                                this.map.set('day', executeDate.getDate())
                                this.map.set('month', executeDate.getMonth()+1)
                            }
                            break
                        }
                    }
                    //每天频率
                    this.ruleForm.dayStartTime && this.setDateInterval()
                }
                return this.map
            }
        },
        mounted(){
            let value = this.$store.state.cronValue.split(' ')
            value = value.map(val => {
                if(/(\*|\/|\?|\-)/.test(val)){
                    return val
                }else{
                    return +val
                }
            })
            if(this.$route.params.id){
                if(/(\-|\/)/.test(this.$store.state.cronValue)){
                    this.ruleForm.planType = '重复执行'
                    this.setRepeatDate(value)
                }else{
                    this.ruleForm.planType = '执行一次'
                    this.ruleForm.onceDateTime = new Date(value[6], value[4]-1, value[3], value[2], value[1], value[0])
                }
            }
        },
        methods: {
            checkTime(time){
                if(time < 10){
                    return `0${time}`
                }else{
                    return time
                }
            },
            setRepeatDate(value){
                if(value){
                    this.setDayInterval(value)
                    this.setCycleOpt(value)
                }
            },
            setCycleOpt(value){
                //执行周期
                for(let i = 3; i < 7; i ++){
                    if((value[i]+'').includes('/')){
                        this.ruleForm.cycle = this.cycleSelect[i-3].value
                        this.ruleForm.interval = value[i].split('/')[1]
                    }
                }

                switch (this.ruleForm.cycle) {
                    case 'month': {
                        let str = value[4].split('/')[0]
                        this.ruleForm.intervalSelect = str.split(',')
                        break
                    }
                    case 'week': {
                        let str = value[5].split('/')[0]
                        this.ruleForm.intervalSelect = str.split(',')
                        break
                    }
                    case 'year': {
                        let date = value[3]
                        let month = value[4]
                        let year = value[6]
                        this.ruleForm.intervalDate = new Date(date, month, 2017)
                    }
                }
            },
            setDayInterval(value){
                //执行间隔
                this.ruleForm.dayType = (value[1] && value[1].includes('/')) ? 'minutes' : 'hour'
                this.ruleForm.dayInterval = (value[1] && value[1].includes('/')) ? value[1].split('/')[1] : value[2].split('/')[1]
                //开始时间
                let startHour = value[2] && value[2].split('/')[0].split('-')[0]
                let startMinutes = value[1] && value[1].split('/')[0].split('-')[0]
                let startSeconds = value[0] && value[0].split('/')[0].split('-')[0]
                this.ruleForm.dayStartTime = new Date(2017, 10, 1, startHour, startMinutes, startSeconds)
                //结束时间
                let endHour = ''
                if(value[2] && value[2].split('/')[0].split('-')[1]){
                    endHour = value[2].split('/')[0].split('-')[1]
                }else{
                    endHour = 0
                }
                let endMinutes = value[1] && value[1].split('/')[0].split('-')[1]
                let endSeconds = value[0] && value[0].split('/')[0].split('-')[1]
                this.ruleForm.dayEndTime = new Date(2017, 10, 1, endHour, endMinutes, endSeconds)

                // console.log(value[2].split('/'))

            },
            setDateInterval(){
                const startTime = this.ruleForm.dayStartTime
                const endTime = this.ruleForm.dayEndTime
                const secondRange = `${startTime.getSeconds()}-${endTime.getSeconds()}`
                const minutesRange = `${startTime.getMinutes()}-${endTime.getMinutes()}`
                const hoursRange = `${startTime.getHours()}-${endTime.getHours()}`
                this.ruleForm.dayInterval = this.ruleForm.dayInterval == 0 ? 1 : this.ruleForm.dayInterval
                this.map.set('seconds', secondRange)
                if(this.ruleForm.dayType == 'hour'){
                    this.map.set('minutes', minutesRange)
                    this.map.set('hours', `${hoursRange}/${this.ruleForm.dayInterval}`)
                }else{
                    this.map.set('hours', hoursRange)
                    this.map.set('minutes', `${minutesRange}/${this.ruleForm.dayInterval}`)
                }
            },
            clearCycle(){
                this.intervalOption = []
                this.ruleForm.intervalSelect = []
                this.ruleForm.intervalDate = ''

                this.map.set('day', '*')
                this.map.set('month', '*')
                this.map.set('year', '*')
            },
            setinterval(){
                const cycle = this.ruleForm.cycle
                // this.
            },
            setCycle(){
                const cycle = this.ruleForm.cycle
                this.map.set(cycle, '*')
                return this.map
            },
            cronSubmit(){
                console.log('submit')
            },
            cronCancel(){
                console.log('cancel')
            },
            submitCron(){
                if(this.errorVisible) return

                this.cron = ''
                const onceDateTime = this.ruleForm.onceDateTime
                for(const value of this.cronMap){
                    this.cron += (value[1] + ' ')
                }
                this.$refs.ruleForm.validate(valid=>{
                    if(valid){
                        this.$store.dispatch('cronValue', this.cron)
                        this.$store.dispatch('closeDialog', false)
                    }else{
                        return false
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    .cron-container{
        .el-radio__label{
            display: inline;
        }
        // .el-form-item{
        //     margin-bottom: 0 !important;
        // }
        .cron-tag-container{
            display: inline-block;
            width: 380px;
        }
        .el-input__inner, .el-select{
            width: 100% !important;
            max-width: 400px;
        }
        .cron-footer{
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
        }
        .el-radio-group{
            padding-left: 0;
        }
        .el-date-editor.el-input{
            width: 193px!important;
        }
        .start-end-date{
            .el-radio-group{
                padding-top: 0;
            }
        }
    }
    .el-range-editor--small .el-range-input{
        font-size: 12px;
    }
</style>


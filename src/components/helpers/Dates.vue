<script>

export default {
    yhToday: moment().format('YYYY-MM-DD'),
    yh30DaysAgo: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    yhOneYearAgo :moment().subtract(1, 'years').format('YYYY-MM-DD'),
    yhTwoYearsAgo: moment().subtract(2, 'years').format('YYYY-MM-DD'),
    yhThreeYearsAgo:moment().subtract(3, 'years').format('YYYY-MM-DD'),
    yhDaysAgo:(days) => {return moment().subtract(days, 'days').format('YYYY-MM-DD')},
}
</script>
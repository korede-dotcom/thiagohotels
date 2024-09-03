

const Event = require('../models/Event');
const {Sequelize} = require("sequelize")

const GetDashboard = async (req,res,next) => {

// Total number of events
const totalEvents = await Event.count();

// Total revenue
const totalRevenue = await Event.sum('amount', { where: { status: true } });

// Number of events by payment mode
const eventsByPaymentMode = await Event.findAll({
  attributes: ['payment_mode', [Sequelize.fn('count', Sequelize.col('*')), 'count']],
  group: ['payment_mode']
});

// Number of events by event type
const eventsByEventType = await Event.findAll({
  attributes: ['event_type', [Sequelize.fn('count', Sequelize.col('*')), 'count']],
  group: ['event_type']
});

// Number of events by status
const eventsByStatus = await Event.findAll({
  attributes: ['status', [Sequelize.fn('count', Sequelize.col('*')), 'count']],
  group: ['status']
});

// Average number of guests per event
// const avgNumGuests = await Event.average('number_of_guests');

// Most popular event type
const mostPopularEventType = await Event.findAll({
  attributes: ['event_type', [Sequelize.fn('count', Sequelize.col('*')), 'count']],
  group: ['event_type'],
  order: [[Sequelize.fn('count', Sequelize.col('*')), 'DESC']],
  limit: 1
});

// Most profitable event
const mostProfitableEvent = await Event.findOne({
  where: { status: true },
  order: [['amount', 'DESC']]
});

// Total revenue by month
const revenueByMonth = await Event.findAll({
  attributes: [
    [Sequelize.fn('date_trunc', 'month', Sequelize.col('event_date')), 'month'],
    [Sequelize.fn('sum', Sequelize.col('amount')), 'totalRevenue']
  ],
  group: ['month']
});

// Number of events by month
const eventsByMonth = await Event.findAll({
    attributes: [
      [Sequelize.fn('date_trunc', 'month', Sequelize.col('event_date')), 'month'],
      [Sequelize.fn('count', Sequelize.col('*')), 'count']
    ],
    group: ['month']
  });
  
  // Average revenue per event
//   const avgRevenuePerEvent = await Event.average('amount', { where: { status: true } });
  
  // Top 5 events with the most guests
  const topEventsByGuests = await Event.findAll({
    order: [['number_of_guests', 'DESC']],
    limit: 5
  });
  
  // Number of events by payment channel
  const eventsByPaymentChannel = await Event.findAll({
    attributes: ['payment_channel', [Sequelize.fn('count', Sequelize.col('*')), 'count']],
    group: ['payment_channel']
  });
  
  
  
  // Number of events by event date
  const eventsByDate = await Event.findAll({
    attributes: [
      [Sequelize.fn('date_trunc', 'day', Sequelize.col('event_date')), 'date'],
      [Sequelize.fn('count', Sequelize.col('*')), 'count']
    ],
    group: ['date']
  });

 return res.json({
    status:true,
    data:{
        totalEvents,
        totalRevenue,
        eventsByDate,
        eventsByEventType,
        eventsByPaymentChannel,
        eventsByMonth,
        eventsByStatus,
        // avgRevenuePerEvent,
        topEventsByGuests,
        mostProfitableEvent,
        revenueByMonth,
        // avgNumGuests,
        mostPopularEventType,
        eventsByPaymentMode
    }
  })


}

module.exports = {
    GetDashboard
}
  